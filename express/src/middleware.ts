import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Container } from '@decorators/di';

/**
 * Middleware class interface
 *
 * @export
 * @interface Middleware
 */
export interface Middleware {
  new (...args: any[]);

  use(request: Request, response: Response, next: NextFunction): void;
}

/**
 * Error middleware class interface
 *
 * @export
 * @interface ErrorMiddleware
 */
export interface ErrorMiddleware {
  new (...args: any[]);

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
export function middlewareHandler(middleware: Middleware): RequestHandler {
  return function(...args: any[]): any {
    let instance: Middleware;

    try {
      instance = Container.get(middleware);
    } catch (e) {
      instance = new middleware();
    }

    return instance.use.apply(instance, args);
  }
}
