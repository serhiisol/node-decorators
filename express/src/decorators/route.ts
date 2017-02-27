import { ExpressClass, Route as RouteType } from '../interface';
import { getMeta, getMiddleware } from '../meta';

/**
 * Add metadata
 * @param {ExpressClass} target Target Class
 * @param {string|symbol} key Function name
 * @param {PropertyDescriptor} descriptor
 * @param {string} method
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
function addMeta(
  target: ExpressClass,
  key: string | symbol,
  descriptor: any,
  method: string,
  url: string,
  middleware?: Function|Function[]
) {
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
 * @param {string} method
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 * @returns { () => ParameterDecorator }
 */
function decoratorFactory(method: string, url: string, middleware: Function|Function[]): MethodDecorator {
  return (target: ExpressClass, key: string | symbol, descriptor: any) => {
    return addMeta(target, key, descriptor, method, url, middleware);
  };
}

/**
 * Get route
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Get = (url: string, middleware?: Function|Function[]): MethodDecorator =>
  decoratorFactory('get', url, middleware);

/**
 * Post route
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Post = (url: string, middleware?: Function|Function[]): MethodDecorator =>
  decoratorFactory('post', url, middleware);

/**
 * Put route
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Put = (url: string, middleware?: Function|Function[]): MethodDecorator =>
  decoratorFactory('put', url, middleware);

/**
 * Delete route
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Delete = (url: string, middleware?: Function|Function[]): MethodDecorator =>
  decoratorFactory('delete', url, middleware);

/**
 * Options route
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Options = (url: string, middleware?: Function|Function[]): MethodDecorator =>
  decoratorFactory('options', url, middleware);

/**
 * Specify custom route method
 * @param {string} method
 * @param {string} url
 * @param {Function|Function[]} [middleware]
 */
export let Route = (method: string, url: string, middleware?: Function|Function[]): MethodDecorator =>
  decoratorFactory(method, url, middleware);
