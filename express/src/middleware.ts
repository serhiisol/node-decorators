import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Container } from '@decorators/di';

export interface MiddlewareClass {
  new (...args: any[]);

  use(request: Request, response: Response, next: NextFunction): void;
}

export type Middleware = MiddlewareClass | RequestHandler;

/**
 * Create request middleware handler that uses class or function provided as middleware
 *
 * @export
 * @param {Middleware} middleware
 * @param {*} context
 *
 * @returns {RequestHandler}
 */
export function middlewareHandler(middleware: Middleware, context: any): RequestHandler {
  return function(...args: any[]): any {
    try {
      return (middleware as RequestHandler).apply(context, args);
    } catch (e) {
      let instance: MiddlewareClass;

      try {
        instance = Container.get(middleware);
      } catch (e) {
        instance = new (middleware as MiddlewareClass)();
      }

      return instance.use.apply(instance, args);
    }
  }
}
