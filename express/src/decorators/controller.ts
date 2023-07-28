import { RouterOptions } from 'express';
import { Injectable } from '@decorators/di';

import { Type } from '../types';
import { ExpressClass, ExpressMeta, getMeta } from '../meta';
import { Middleware } from '../middleware';

/**
 * Registers controller for base url
 */
export function Controller(url: string, middleware?: Middleware[]): ClassDecorator;
export function Controller(url: string, routerOptions?: RouterOptions, middleware?: Middleware[]): ClassDecorator;
export function Controller(url: string, middlewareOrRouterOptions?: Middleware[] | RouterOptions, middleware: Middleware[] = []) {
  return (target: Type) => {
    const meta: ExpressMeta = getMeta(target.prototype as ExpressClass);

    meta.url = url;
    meta.middleware = Array.isArray(middlewareOrRouterOptions) ? middlewareOrRouterOptions : middleware;
    meta.routerOptions = Array.isArray(middlewareOrRouterOptions) ? null : middlewareOrRouterOptions;

    Injectable()(target);
  };
}
