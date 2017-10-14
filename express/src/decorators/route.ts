import { RequestHandler } from 'express';

import { ExpressClass, Route as RouteType } from '../interface';
import { getMeta, getMiddleware } from '../meta';

/**
 * Add metadata
 *
 * @param {ExpressClass} target Target Class
 * @param {string|symbol} key Function name
 * @param {PropertyDescriptor} descriptor
 * @param {string} method
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 */
function addMeta(
  target: ExpressClass,
  key: string | symbol,
  descriptor: any,
  method: string,
  url: string,
  middleware?: RequestHandler|RequestHandler[]
): any {
  let meta = getMeta(target);
  meta.routes[key] = <RouteType>{method, url};
  if (!meta.middleware[key]) {
    meta.middleware[key] = [];
  }
  meta.middleware[key].push(...getMiddleware(middleware));

  return descriptor;
}

/**
 * Route decorator factory, creates decorator
 *
 * @param {string} method
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 *
 * @returns { () => ParameterDecorator }
 */
function decoratorFactory(method: string, url: string, middleware: RequestHandler|RequestHandler[]): MethodDecorator {
  return (target: ExpressClass, key: string | symbol, descriptor: any) => {
    return addMeta(target, key, descriptor, method, url, middleware);
  };
}

/**
 * Get route
 *
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 */
export let Get = (url: string, middleware?: RequestHandler|RequestHandler[]): MethodDecorator =>
  decoratorFactory('get', url, middleware);

/**
 * Post route
 *
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 */
export let Post = (url: string, middleware?: RequestHandler|RequestHandler[]): MethodDecorator =>
  decoratorFactory('post', url, middleware);

/**
 * Put route
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 */
export let Put = (url: string, middleware?: RequestHandler|RequestHandler[]): MethodDecorator =>
  decoratorFactory('put', url, middleware);

/**
 * Delete route
 *
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 */
export let Delete = (url: string, middleware?: RequestHandler|RequestHandler[]): MethodDecorator =>
  decoratorFactory('delete', url, middleware);

/**
 * Options route
 *
 * @param {string} url
 * @param {RequestHandler|RequestHandler[]} [middleware]
 */
export let Options = (url: string, middleware?: RequestHandler|RequestHandler[]): MethodDecorator =>
  decoratorFactory('options', url, middleware);

/**
 * Specify custom route method
 *
 * @param {string} method
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Route = (method: string, url: string, middleware?: RequestHandler|RequestHandler[]): MethodDecorator =>
  decoratorFactory(method, url, middleware);
