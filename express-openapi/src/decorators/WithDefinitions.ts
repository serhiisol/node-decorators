import { getMeta } from "@decorators/express/lib/src/meta";
import { getOpenApiDoc } from "../helpers";
import { getOpenApiMeta } from "../meta";
import { PathMeta } from "../types";

type WithDefinitionsOpts = {
  tags?: string[]
  basePath: string;
}

export function WithDefinitions(options: WithDefinitionsOpts): ClassDecorator {
  return (target: any) => {
    const meta = getOpenApiMeta(target.prototype);
    const paths = getOpenApiDoc().paths;
    const { routes } = getMeta(target.prototype);
    const basePath = options?.basePath || '/';
    const globalTags = options.tags || [];

    Object.keys(meta).forEach(methodName => {
      const pathMeta = meta[methodName];
      getRoutes(routes, methodName).forEach(route => {
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
          parameters: pathMeta.parameters,
          deprecated: isDeprecated(route.url, pathMeta),
          requestBody: pathMeta.requestBody,
          responses: pathMeta.responses,
        })
      });
    });
  }
}

// to easily migrate to a multi-route approach
// for each method get all associated routes
function getRoutes(routes: any, methodName: string) {
  const route = routes[methodName];
  if (!route) return [];
  return [route];
}

function getPathName(basePath: string, url: string) {
  // remove all slashes from the end of the base url
  if (basePath.endsWith('/')) basePath = basePath.replace(/\/+$/, '');
  // if url does not start with a slash, then add it
  if (!url.startsWith('/')) url = `/${url}`;
  const result = `${basePath}${url}`;
  if (result.length === 1) return result;
  return result.replace(/\/+$/, '');
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
