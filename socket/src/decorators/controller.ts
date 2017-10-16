import { SocketMeta, MiddlewareType, MiddlewareFunction } from '../interface';
import { getMeta, prepareMiddleware } from '../utils';

/**
 * Defines namespace for the controller and controller-based middleware
 *
 * @param {string} [ns = '/']
 * @param {MiddlewareFunction|MiddlewareFunction[]} [fn]
 */
export const Controller = (ns = '/', fn?: MiddlewareFunction|MiddlewareFunction[]): ClassDecorator => {
  return (target): void => {
    const meta: SocketMeta = getMeta(target.prototype);
    const middleware: MiddlewareFunction[] = prepareMiddleware(fn);

    meta.ns = ns;

    meta.middleware.push({
      middleware,
      type: MiddlewareType.Controller
    });
  };
};
