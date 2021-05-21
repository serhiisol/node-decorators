import { ExpressMeta, getMeta } from '../meta';
import { Type } from '../middleware';

/**
 * Route decorator factory, creates decorator
 *
 * @param {string} method
 * @param {string} url
 * @param {Type[]} [middleware=[]]
 * @param {string[]} [aliases=[]]
 */
function decoratorFactory(method: string, url: string, middleware: Type[] = [], aliases: string[] = []) {
  return (target: any, key: string, descriptor: any) => {
    const meta: ExpressMeta = getMeta(target);

    if (!meta.routes[key]) {
      meta.routes[key] = { method, url, middleware, aliases };
    } else {
      // Replace method and route but concatenate middlewares from previous route and aliases
      meta.routes[key] = {
        method,
        url,
        middleware: middleware.concat(meta.routes[key].middleware),
        aliases: Array.from(new Set([...aliases, ...meta.routes[key].aliases]))
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
 * @param {string[]} [aliases]
 */
export function All(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('all', url, middleware, aliases);
}

/**
 * Get route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Get(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('get', url, middleware, aliases);
}

/**
 * Post route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Post(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('post', url, middleware, aliases);
}

/**
 * Put route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Put(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('put', url, middleware, aliases);
}

/**
 * Delete route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Delete(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('delete', url, middleware, aliases);
}

/**
 * Patch route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Patch(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('patch', url, middleware, aliases);
}

/**
 * Options route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Options(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('options', url, middleware, aliases);
}

/**
 * Head route
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 * @param {string[]} [aliases]
 */
export function Head(url: string, middleware?: Type[], aliases?: string[]) {
  return decoratorFactory('head', url, middleware, aliases);
}
