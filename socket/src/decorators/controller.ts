import { getMeta, SocketClass } from '../meta';
import { Middleware } from '../middleware';

/**
 * Defines namespace for the controller and controller-based middleware
 */
export function Controller(namespace: string, middleware?: Middleware[]): ClassDecorator {
  return target => {
    const meta = getMeta(target.prototype as SocketClass);

    meta.namespace = namespace;
    meta.middleware = middleware;
  };
}
