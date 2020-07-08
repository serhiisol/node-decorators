import { RouterOptions } from 'express';

import { ExpressMeta, getMeta } from '../meta';
import { Type } from '../middleware';

/**
 * Registers controller for base url
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Controller(url: string, routerOptions?: Type[] | RouterOptions, middleware?: Type[]) {
  return (target): void => {
    const meta: ExpressMeta = getMeta(target.prototype);

    meta.url = url;
    meta.middleware = Array.isArray(routerOptions) ? routerOptions : middleware;
    meta.routerOptions = Array.isArray(routerOptions) ? null : routerOptions;
  };
}
