import { RequestHandler } from 'express';

import { ExpressMeta } from '../interface';
import { getMeta, getMiddleware } from '../meta';

/**
 * Registers controller for base url
 * @param {string} baseUrl
 * @param {Function|Function[]} [middleware]
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Controller = (baseUrl: string, middleware?: RequestHandler|RequestHandler[]): ClassDecorator  => {
  return (target: Function): void => {
    let meta: ExpressMeta = getMeta(target.prototype);
    meta.baseUrl = baseUrl;
    meta.controllerMiddleware = getMiddleware(middleware);
  };
};
