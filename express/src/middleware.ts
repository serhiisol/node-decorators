import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Container } from '@decorators/di';

export interface MiddlewareClass {
  new (...args: any[]);

  use(request: Request, response: Response, next: NextFunction): void;
}

export type Middleware = MiddlewareClass | RequestHandler;

/**
 * Create request middleware handler that uses class and function provided as middleware
 *
 * @export
 * @param {Middleware} middleware
 * @returns {RequestHandler}
 */
export function getMiddleware(middleware: Middleware): RequestHandler {
  return function(...args: any[]): any {
    try {
      return (middleware as RequestHandler).apply(this, args);
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
