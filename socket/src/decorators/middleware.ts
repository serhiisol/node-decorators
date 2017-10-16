import { SocketMeta, MiddlewareType, MiddlewareFunction } from '../interface';
import { getMeta, prepareMiddleware } from '../utils';

/**
 * Registers global middleware
 *
 * @param {MiddlewareFunction|MiddlewareFunction[]} fn
 */
export const ServerMiddleware = (fn: MiddlewareFunction|MiddlewareFunction[]): ClassDecorator  => {
  return (target): void => {
    const meta: SocketMeta = getMeta(target.prototype);
    const middleware: MiddlewareFunction[] = prepareMiddleware(fn);

    meta.middleware.push({
      middleware,
      type: MiddlewareType.IO
    });
  };
};

/**
 * Registers socket middleware
 *
 * @param {MiddlewareFunction|MiddlewareFunction[]} fn
 */
export let Middleware = (fn: MiddlewareFunction|MiddlewareFunction[]): ClassDecorator  => {
  return (target): void => {
    const meta: SocketMeta = getMeta(target.prototype);
    const middleware: MiddlewareFunction[] = prepareMiddleware(fn);

    meta.middleware.push({
      middleware,
      type: MiddlewareType.Socket
    });
  };
};
