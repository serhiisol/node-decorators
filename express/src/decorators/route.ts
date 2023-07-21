import { ExpressMeta, getMeta, MethodMeta } from '../meta';
import { Middleware } from '../middleware';

/**
 * Route decorator factory, creates decorator
 */
function decoratorFactory(method: string, url: string, middleware: Middleware[] = []) {
  return (target: object, key: string, descriptor: any) => {
    const methodMetadata = getRouteMeta(target, key);

    methodMetadata.routes.push({ method, url, middleware });

    return descriptor;
  };
}

/**
 * All routes
 *
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 */
export function All(url: string, middleware?: Middleware[]) {
  return decoratorFactory('all', url, middleware);
}

/**
 * Get route
 */
export function Get(url: string, middleware?: Middleware[]) {
  return decoratorFactory('get', url, middleware);
}

/**
 * Post route
 */
export function Post(url: string, middleware?: Middleware[]) {
  return decoratorFactory('post', url, middleware);
}

/**
 * Put route
 */
export function Put(url: string, middleware?: Middleware[]) {
  return decoratorFactory('put', url, middleware);
}

/**
 * Delete route
 */
export function Delete(url: string, middleware?: Middleware[]) {
  return decoratorFactory('delete', url, middleware);
}

/**
 * Patch route
 */
export function Patch(url: string, middleware?: Middleware[]) {
  return decoratorFactory('patch', url, middleware);
}

/**
 * Options route
 */
export function Options(url: string, middleware?: Middleware[]) {
  return decoratorFactory('options', url, middleware);
}

/**
 * Head route
 *
 */
export function Head(url: string, middleware?: Middleware[]) {
  return decoratorFactory('head', url, middleware);
}

/**
 * Method status
 */
export function Status(status: number) {
  return (target: object, key: string, descriptor: any) => {
    const methodMetadata = getRouteMeta(target, key);

    methodMetadata.status = status;

    return descriptor;
  };
}

function getRouteMeta(target: object, key: string): MethodMeta {
  const meta: ExpressMeta = getMeta(target);

  return meta.routes[key] = meta.routes[key] || {
    routes: [],
  };
}
