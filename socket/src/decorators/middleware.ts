import { Meta, MiddlewareType } from '../interface';
import { getMeta } from '../meta';
import { prepareMiddleware } from '../utils';

/**
 * Registers global middleware
 *
 * @param {Function|Function[]} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export const ServerMiddleware = (fn: Function|Function[]): ClassDecorator  => {
  return (target: Function): void => {
    const meta: Meta = getMeta(target.prototype);
    const middleware: Function[] = prepareMiddleware(fn);

    meta.middleware.push({
      middleware,
      type: MiddlewareType.IO
    });
  };
};

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let GlobalMiddleware = (fn: Function|Function[]): ClassDecorator  => {
  return (target: Function): void => {
    const meta: Meta = getMeta(target.prototype);
    const middleware: Function[] = prepareMiddleware(fn);

    meta.middleware.push({
      middleware,
      type: MiddlewareType.Socket
    });
  };
};

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Middleware = (fn: Function|Function[]): ClassDecorator  => {
  return (target: Function): void => {
    const meta: Meta = getMeta(target.prototype);
    const middleware: Function[] = prepareMiddleware(fn);

    meta.middleware.push({
      middleware,
      type: MiddlewareType.Controller
    });
  };
};
