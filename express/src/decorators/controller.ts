import { ExpressMeta, getMeta } from '../meta';
import { Type } from '../middleware';

/**
 * Registers controller for base url
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Controller(url: string, middleware?: Type[]) {
  return (target): void => {
    const meta: ExpressMeta = getMeta(target.prototype);

    meta.url = url;
    meta.middleware = middleware;
  };
};
