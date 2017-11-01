import { Request, Response, NextFunction, RequestHandler } from 'express';
import { Container } from '@decorators/di';

export abstract class MiddlewareClass {
  public abstract use(request: Request, response: Response, next: NextFunction);
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
      return (middleware as RequestHandler).apply(this, ...args);
    } catch (e) {
      const instance: MiddlewareClass = Container.get(middleware);
      return instance.use.apply(instance, ...args);
    }
  }
}
