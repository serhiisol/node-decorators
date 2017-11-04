import { ExpressMeta, getMeta } from '../meta';
import { Middleware } from '../middleware';

/**
 * Registers controller for base url
 *
 * @param {string} url
 * @param {Middleware[]} [middleware]
 */
export function Controller(url: string, middleware?: Middleware[]) {
  return (target): void => {
    const meta: ExpressMeta = getMeta(target.prototype);

    meta.url = url;
    meta.middleware = middleware;
  };
};
