import { SocketMeta, MiddlewareType } from '../interface';
import { getMeta, prepareMiddleware } from '../utils';

/**
 * Defines namespace for the controller and controller-based middleware
 *
 * @param {string} [ns = '/']
 * @param {Function|Function[]} [fn]
 */
export const Controller = (ns = '/', fn?: Function|Function[]): ClassDecorator => {
  return (target: Function): void => {
    const meta: SocketMeta = getMeta(target.prototype);
    const middleware: Function[] = prepareMiddleware(fn);

    meta.ns = ns;

    meta.middleware.push({
      middleware,
      type: MiddlewareType.Controller
    });
  };
};
