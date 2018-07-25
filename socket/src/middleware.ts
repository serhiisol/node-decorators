import { Container, InjectionToken } from '@decorators/di';

/**
 * IO Middleware class registration DI token
 */
export const IO_MIDDLEWARE = new InjectionToken('IO_MIDDLEWARE');

export interface Type extends Function {
  new (...args: any[]);
}

export type NextFunction = (err?: Error) => void;

/**
 * Server Middleware class interface
 *
 * @export
 * @interface ServerMiddleware
 */
export interface ServerMiddleware {
  use(
    io: SocketIO.Server | SocketIO.Namespace,
    socket: SocketIO.Socket,
    next: NextFunction
  ): void;
}

/**
 * Middleware class interface
 *
 * @export
 * @interface Middleware
 */
export interface Middleware {
  use(
    io: SocketIO.Server | SocketIO.Namespace,
    socket: SocketIO.Socket,
    args: any,
    next: NextFunction
  ): void;
}

/**
 * Create request middleware handler that uses class or function provided as middleware
 *
 * @export
 * @param {Type | InjectionToken} middleware
 *
 * @returns {RequestHandler}
 */
export function middlewareHandler(middleware: Type | InjectionToken) {
  return function(...args: any[]): any {
    let instance: Middleware | ServerMiddleware;

    try {
      instance = Container.get(middleware);
    } catch (e) {
      instance = new (middleware as Type)();
    }

    return instance.use.apply(instance, args);
  }
}

/**
 * Loops through all registered middlewares
 *
 * @param {Type[]} middleware Array of middleware
 * @param {any[]} [args = []] Arguments to pass in
 *
 * @returns {Promise<*>}
 */
export function executeMiddleware(middleware: Type[], args: any[] = []): Promise<any> {
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
