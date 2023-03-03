import { getMeta } from '@decorators/express/lib/src/meta';
import { getOpenApiDoc } from '../helpers';
import { getOpenApiMeta } from '../meta';
import { ParamDef, ParamLocation, PathMeta, PathResponses, PathSecurity } from '../types';

type WithDefinitionsOpts = {
  tags?: string[];
  security?: PathSecurity;
  responses?: PathResponses;
  basePath: string;
}

export function WithDefinitions(options: WithDefinitionsOpts): ClassDecorator {
  return (target: any) => {
    (async () => {
      const meta = getOpenApiMeta(target.prototype);
      const { paths } = await getOpenApiDoc();
      const { routes, params } = getMeta(target.prototype);
      const basePath = options?.basePath || '/';
      const globalTags = options.tags ?? [];
      const globalSecurity = options.security ?? [];
      const globalResponses = options.responses ?? {};
  
      Object.keys(meta).forEach(methodName => {
        const pathMeta = meta[methodName];
        const routeParams = params[methodName];
        getRoutes(routes, methodName).forEach((route: { method: string; url: string; }) => {
          // as openapi does not support nested urls, need to concat the controller url with the one from the method
          const url = getPathName(basePath, route.url);
          // the path might exist already (because of another http verb - ie GET /users and POST /users).
          // do not override but extend it
          const path = paths[url] = paths[url] || {};
          // if the same path and method was already defined, then override the previous one
          const method = path[route.method] = {};
          // add method specifications to the open api document
          Object.assign(method, {
            tags: getTags(pathMeta.tags, globalTags, target.name),
            summary: pathMeta.summary,
            description: pathMeta.description,
            parameters: getParameters(pathMeta, getRouteParams(routeParams)),
            deprecated: isDeprecated(route.url, pathMeta),
            requestBody: pathMeta.requestBody,
            responses: getRespones(pathMeta.responses, globalResponses),
            security: getSecurity(pathMeta.security, globalSecurity),
          })
        });
      });
    })();
  }
}

// to easily migrate to a multi-route approach
// for each method get all associated routes
function getRoutes(routes: any, methodName: string) {
  const route = routes[methodName];
  return route.routes ? route.routes : [];
}

function getPathName(basePath: string, url: string) {
  // remove all slashes from the end of the base url
  if (basePath.endsWith('/')) basePath = basePath.replace(/\/+$/, '');
  // if url does not start with a slash, then add it
  if (!url.startsWith('/')) url = `/${url}`;
  const result = `${basePath}${url}`;
  if (result.length === 1) return fixRouteParams(result);
  return fixRouteParams(result.replace(/\/+$/, ''));
}

function fixRouteParams(url: string) {
  // openapi requires route parameters to be in `/foo/{bar}` format as opposed to `/foo/:bar`
  return url.replace(/\/:([a-zA-Z\d-]*)/g, "/{$1}")
}

function getSecurity(pathSecurity?: PathSecurity, globalSecurity?: PathSecurity) {
  const security = [];
  if (pathSecurity) security.push(...pathSecurity);
  if (globalSecurity) security.push(...globalSecurity);
  return security.length ? security : undefined;
}

function getRespones(pathResponses?: PathResponses, globalResponses?: PathResponses): PathResponses {
  const responses = [
    ...Object.entries(globalResponses ?? {}),
    ...Object.entries(pathResponses ?? {}),
  ]
  
  return responses.reduce<PathResponses>((a, [k, v]) => ({ ...a, [k]: v }), {})
}

function getTags(pathTags: string[], globalTags: string[], defaultTag: string) {
  const tags = [];
  if (pathTags) tags.push(...pathTags);
  if (globalTags) tags.push(...globalTags);
  if (tags.length) {
    return Array.from(new Set(tags));
  }
  return [defaultTag];
}

function isDeprecated(url: string, pathMeta: PathMeta): boolean {
  if (pathMeta.deprecated === true) return true;
  return Array.isArray(pathMeta.deprecated) && pathMeta.deprecated.indexOf(url) >= 0;
}

const ExpressParamType: { [key: number]: ParamLocation } = {
  2: 'path',
  3: 'query',
  5: 'header',
  6: 'cookie',
};

function getRouteParams(params: { type: number, name?: string }[]): ParamDef[] {
  return params
    .filter(({ type, name }) => ExpressParamType[type] && name)
    .map(({ type, name }) => ({ name, in: ExpressParamType[type], required: ExpressParamType[type] === 'path' }));
}

function getParameters(meta: PathMeta, routeParams: ParamDef[] = []): ParamDef[] {
  const parameters = meta.parameters || [];
  routeParams.forEach(param => {
    if (parameters.findIndex(p => p.name === param.name && p.in === param.in) < 0) {
      // there is no parameter with this name and location,
      // add the definition
      parameters.push(param);
    }
  });
  return parameters;
}
