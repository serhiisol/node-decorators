import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { Container, InjectionToken } from '@decorators/di';

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
 * @param {Type} middleware
 *
 * @returns {RequestHandler}
 */
export function middlewareHandler(middleware: Type): RequestHandler {
  return function(req: Request, res: Response, next: NextFunction): any {
    try {
      return getMiddleware(middleware, [req, res, next]);
    } catch (error) {
      next(error);
    }
  }
}

/**
 * Error Middleware class registration DI token
 */
export const ERROR_MIDDLEWARE = new InjectionToken('ERROR_MIDDLEWARE');

/**
 * Add error middleware to the app
 *
 * @returns {ErrorRequestHandler}
 */
export function errorMiddlewareHandler(): ErrorRequestHandler {
  return function(error: Error, req: Request, res: Response, next: NextFunction): void {
    try {
      return getMiddleware(ERROR_MIDDLEWARE, [error, req, res, next]);
    } catch {
      next(error);
    }
  }
}

/**
 * Instantiate middleware and invoke it with arguments
 *
 * @param {InjectionToken | Type} middleware
 * @param {any[]} args
 */
function getMiddleware(middleware: InjectionToken | Type, args: any[]) {
  const next: NextFunction = args[args.length - 1]; // last parameter is always the next function
  let instance;

  try {
    // first, trying to get instance from the container
    instance = Container.get(middleware);
  } catch {
    try {
      // if container fails, trying to instantiate it
      instance = new (middleware as Type)();
    } catch {
      // if instantiation fails, try to use it as is
      instance = middleware as any;
    }
  }

  // first, assuming that middleware is a class, try to use it,
  // otherwise use it as a function
  const result = instance.use ?
    (instance as Middleware | ErrorMiddleware).use.apply(instance, args) :
    (instance as Type).apply(instance, args);

  // if result of execution is a promise, add additional listener to catch error
  if (result instanceof Promise) {
    result.catch(e => next(e));
  }

  return result
}
