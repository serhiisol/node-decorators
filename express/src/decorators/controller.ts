import { RouterOptions } from 'express';

import { ExpressMeta, getMeta } from '../meta';
import { Type } from '../middleware';

/**
 * Registers controller for base url
 *
 * @param {string} url
 * @param {Type[]} [middleware]
 */
export function Controller(url: string, middleware?: Type[]);
/**
 * Registers controller for base url
 *
 * @param {string} url
 * @param routerOptions
 * @param {Type[]} [middleware]
 */
export function Controller(url: string, routerOptions?: RouterOptions, middleware?: Type[]);
export function Controller(url: string, middlewareOrRouterOptions?: Type[] | RouterOptions, middleware: Type[] = []) {
  return (target): void => {
    const meta: ExpressMeta = getMeta(target.prototype);

    meta.url = url;
    meta.middleware = Array.isArray(middlewareOrRouterOptions) ? middlewareOrRouterOptions.concat(meta.middleware ?? []) : middleware.concat(meta.middleware ?? []);
    meta.routerOptions = Array.isArray(middlewareOrRouterOptions) ? null : middlewareOrRouterOptions;
  };
}
