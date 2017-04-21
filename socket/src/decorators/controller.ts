import { Meta, MiddlewareType } from '../interface';
import { getMeta, prepareMiddleware } from '../utils';

/**
 * Defines namespace for the controller and controller-based middleware
 *
 * @param {string} ns
 */
export const Controller = (ns: string, fn: Function|Function[]): ClassDecorator => {
  return (target: Function): void => {
    const meta: Meta = getMeta(target.prototype);
    const middleware: Function[] = prepareMiddleware(fn);

    meta.ns = ns;

    meta.middleware.push({
      middleware,
      type: MiddlewareType.Controller
    });

  };
};
