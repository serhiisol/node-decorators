import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Container } from '@decorators/di';

export interface Type extends Function {
  new (...args: any[]);
}

/**
 * Middleware class interface
 *
 * @export
 * @interface Middleware
 */
export interface Middleware {
  use(request: Request, response: Response, next: NextFunction): void;
}

/**
 * Error middleware interface
 *
 * @export
 * @interface ErrorMiddleware
 */
export interface ErrorMiddleware {
  use(error: any, request: Request, response: Response, next: NextFunction): void;
}

/**
 * Create request middleware handler that uses class or function provided as middleware
 *
 * @export
 * @param {Middleware} middleware
 *
 * @returns {RequestHandler}
 */
export function middlewareHandler(middleware: Type): RequestHandler {
  return function(...args: any[]): any {
    let instance: Middleware;

    try {
      instance = Container.get(middleware);
    } catch {
      instance = new middleware();
    }

    return instance.use.apply(instance, args);
  }
}
