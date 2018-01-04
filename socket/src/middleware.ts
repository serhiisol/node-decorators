import { Container, InjectionToken } from '@decorators/di';

/**
 * IO Middleware class registration DI token
 */
export const IO_MIDDLEWARE = new InjectionToken('IO_MIDDLEWARE');

export type NextFunction = (err?: Error) => void;

/**
 * Middleware class interface
 *
 * @export
 * @interface Middleware
 */
export interface Middleware {
  new (...args: any[]);

  use(...args: any[]): void;
}

/**
 * Create request middleware handler that uses class or function provided as middleware
 *
 * @export
 * @param {Middleware} middleware
 *
 * @returns {RequestHandler}
 */
export function middlewareHandler(middleware: Middleware | InjectionToken) {
  return function(...args: any[]): any {
    let instance: Middleware;

    try {
      instance = Container.get(middleware);
    } catch (e) {
      instance = new (middleware as Middleware)();
    }

    return instance.use.apply(instance, args);
  }
}

/**
 * Loops through all registered middlewares
 *
 * @description middleware approach
 * @param {MiddlewareFunction[]} fns Array of middleware functions
 * @param {any[]} [args = []] Arguments to pass in
 *
 * @returns {Promise<*>}
 */
export function executeMiddleware(middleware: Middleware[], args: any[] = []): Promise<any> {
  function iteratee(done: (err: Error) => void, i = 0) {
    try {
      middlewareHandler(middleware[i])(...args, (err) => {
        if (err) {
          return done(err);
        }

        if (i === middleware.length - 1) {
          return done(null);
        }

        iteratee(done, ++i);
      });
    } catch (e) {
      done(e);
    }
  }

  return new Promise((resolve, reject) => {
    if (middleware === undefined || middleware.length === 0) {
      return resolve();
    }

    iteratee((err: Error) => err ? reject(err) : resolve());
  });
}
