import { ExpressMeta, ExpressClass, getMeta } from '../meta';
import { Middleware } from '../middleware';

/**
 * Route decorator factory, creates decorator
 *
 * @param {string} method
 * @param {string} url
 * @param {Middleware|Middleware[]} [middleware]
 */
function decoratorFactory(method: string, url: string, middleware: Middleware|Middleware[]) {
  return (target: ExpressClass, key: string | symbol, descriptor: any) => {
    const meta: ExpressMeta = getMeta(target);

    meta.routes[key] = { method, url, middleware };

    return descriptor;
  };
}

/**
 * Get route
 *
 * @param {string} url
 * @param {Middleware|Middleware[]} [middleware]
 */
export function Get(url: string, middleware?: Middleware|Middleware[]) {
  return decoratorFactory('get', url, middleware)
};

/**
 * Post route
 *
 * @param {string} url
 * @param {Middleware|Middleware[]} [middleware]
 */
export function Post(url: string, middleware?: Middleware|Middleware[]) {
  return decoratorFactory('post', url, middleware);
}

/**
 * Put route
 * @param {string} url
 * @param {Middleware|Middleware[]} [middleware]
 */
export function Put(url: string, middleware?: Middleware|Middleware[]) {
  return decoratorFactory('put', url, middleware);
}

/**
 * Delete route
 *
 * @param {string} url
 * @param {Middleware|Middleware[]} [middleware]
 */
export function Delete(url: string, middleware?: Middleware|Middleware[]) {
  return decoratorFactory('delete', url, middleware);
}

/**
 * Options route
 *
 * @param {string} url
 * @param {Middleware|Middleware[]} [middleware]
 */
export function Options(url: string, middleware?: Middleware|Middleware[]) {
  return decoratorFactory('options', url, middleware);
}

/**
 * Specify custom route method
 *
 * @param {string} method
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export function Route(method: string, url: string, middleware?: Middleware|Middleware[]) {
  return decoratorFactory(method, url, middleware);
}
