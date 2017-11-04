import { ExpressMeta, ExpressClass, getMeta } from '../meta';
import { Middleware } from '../middleware';

/**
 * Route decorator factory, creates decorator
 *
 * @param {string} method
 * @param {string} url
 * @param {Middleware[]} middleware
 */
function decoratorFactory(method: string, url: string, middleware: Middleware[]) {
  return (target: ExpressClass, key: string | symbol, descriptor: any) => {
    const meta: ExpressMeta = getMeta(target);

    meta.routes[key] = { method, url, middleware };

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
 * @param {Middleware[]} [middleware]
 */
export function All(url: string, middleware?: Middleware[]) {
  return decoratorFactory('all', url, middleware)
};

/**
 * Get route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Get(url: string, middleware?: Middleware[]) {
  return decoratorFactory('get', url, middleware)
};

/**
 * Post route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Post(url: string, middleware?: Middleware[]) {
  return decoratorFactory('post', url, middleware);
}

/**
 * Put route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Put(url: string, middleware?: Middleware[]) {
  return decoratorFactory('put', url, middleware);
}

/**
 * Delete route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Delete(url: string, middleware?: Middleware[]) {
  return decoratorFactory('delete', url, middleware);
}

/**
 * Patch route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Patch(url: string, middleware?: Middleware[]) {
  return decoratorFactory('patch', url, middleware);
}

/**
 * Options route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Options(url: string, middleware?: Middleware[]) {
  return decoratorFactory('options', url, middleware);
}

/**
 * Head route
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Head(url: string, middleware?: Middleware[]) {
  return decoratorFactory('head', url, middleware);
}
