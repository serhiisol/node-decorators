import { ExpressMeta, getMeta } from '../meta';
import { Type } from '../middleware';

/**
 * Route decorator factory, creates decorator
 *
 * @param {string} httpMethod
 * @param {string} url
 * @param {Type[]} middleware
 */
function decoratorFactory(httpMethod: string, url: string, middleware: Type[] = []) {
  return (target: any, key: string, descriptor: any) => {
    const meta: ExpressMeta = getMeta(target);

    // init the routes dictionary
    const routes = meta.routes[key] = meta.routes[key] || {};
    const routeKey = `${httpMethod}.${url}`;
    if (routes[routeKey]) {
      // the combination of httpMethod and url is already registered for this method (fn)
      // let's not register a new route but concat its middlewares
      routes[routeKey].middleware = [...routes[routeKey].middleware, ...middleware];
    } else {
      // this is a new route for the method
      routes[routeKey] = {
        method: httpMethod,
        url,
        middleware,
      };
    }
    return descriptor;
  };
}

/**
 * All routes
 *
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function All(url: string, middleware?: Type[]) {
  return decoratorFactory('all', url, middleware);
}

/**
 * Get route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Get(url: string, middleware?: Type[]) {
  return decoratorFactory('get', url, middleware);
}

/**
 * Post route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Post(url: string, middleware?: Type[]) {
  return decoratorFactory('post', url, middleware);
}

/**
 * Put route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Put(url: string, middleware?: Type[]) {
  return decoratorFactory('put', url, middleware);
}

/**
 * Delete route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Delete(url: string, middleware?: Type[]) {
  return decoratorFactory('delete', url, middleware);
}

/**
 * Patch route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Patch(url: string, middleware?: Type[]) {
  return decoratorFactory('patch', url, middleware);
}

/**
 * Options route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Options(url: string, middleware?: Type[]) {
  return decoratorFactory('options', url, middleware);
}

/**
 * Head route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Head(url: string, middleware?: Type[]) {
  return decoratorFactory('head', url, middleware);
}
