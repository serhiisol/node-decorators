import { getMeta, SocketMeta } from '../meta';
import { Middleware } from '../middleware';

/**
 * Defines namespace for the controller and controller-based middleware
 *
 * @param {string} namespace
 * @param {Middleware[]} [middleware]
 */
export function Controller(namespace: string, middleware?: Middleware[]) {
  return (target): void => {
    const meta: SocketMeta = getMeta(target.prototype);

    meta.namespace = namespace;
    meta.middleware = middleware;
  };
};
