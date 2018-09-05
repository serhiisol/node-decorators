import { getMeta, SocketMeta } from '../meta';
import { Type } from '../middleware';

/**
 * Defines namespace for the controller and controller-based middleware
 *
 * @param {string} namespace
 * @param {Type[]} [middleware]
 */
export function Controller(namespace: string, middleware?: Type[]) {
  return (target): void => {
    const meta: SocketMeta = getMeta(target.prototype);

    meta.namespace = namespace;
    meta.middleware = middleware;
  };
};
