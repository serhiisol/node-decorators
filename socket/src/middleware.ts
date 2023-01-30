import { Container, InjectionToken } from '@decorators/di';
import { Server, Namespace, Socket } from 'socket.io';

export type NextFunction = (err?: Error) => void;

export type Type<C extends object = object> = new (...args: any) => C;

/**
 * Middleware class interface
 */
export type MiddlewareFunction = (io: Server | Namespace, socket: Socket, args: unknown, next: NextFunction) => void;
export interface MiddlewareClass {
  use: MiddlewareFunction;
}
export type Middleware = MiddlewareFunction | Type<MiddlewareClass>;


/**
 * Server Middleware
 */
export type ServerMiddlewareFunction = (io: Server | Namespace, socket: Socket, next: NextFunction) => void;
export interface ServerMiddlewareClass {
  use: ServerMiddlewareFunction;
}
export type ServerMiddleware = ServerMiddlewareFunction | Type<ServerMiddlewareClass>;

/**
 * IO Middleware class registration DI token
 */
export const IO_MIDDLEWARE = new InjectionToken('IO_MIDDLEWARE');

/**
 * Create request middleware handler that uses class or function provided as middleware
 */
export async function middlewareHandler(
  middleware: Middleware | InjectionToken,
  args: Parameters<MiddlewareFunction> | Parameters<ServerMiddlewareFunction>
) {
  const next = args[args.length - 1] as NextFunction;

  try {
    let instance: MiddlewareClass | ServerMiddlewareClass | MiddlewareFunction;

    if (typeof middleware === 'function') {
      if (middleware.prototype?.use) {
        instance = new (middleware as Type<MiddlewareClass | ServerMiddlewareClass>)(...args);
      } else {
        instance = middleware as MiddlewareFunction;
      }
    } else {
      instance = await Container.get(middleware);
    }

    const handler = (instance as MiddlewareClass | ServerMiddlewareClass)?.use ?? instance;
    const result = typeof handler === 'function' ? handler.apply(instance, args) : instance;

    if (result instanceof Promise) {
      result.catch(next);
    }
  } catch (err) {
    next(err as Error);
  }
}

/**
 * Loops through all registered middlewares
 */
export function executeMiddleware(middleware: Middleware[], args: unknown[] = []): Promise<any> {
  function iteratee(done: (err?: Error) => void, i = 0) {
    middlewareHandler(middleware[i], [...args, (err?: Error) => {
      if (err) {
        done(err);
      } else if (i === middleware.length - 1) {
        done();
      } else {
        iteratee(done, ++i);
      }
    }] as Parameters<MiddlewareFunction> | Parameters<ServerMiddlewareFunction>)
      .catch(done);
  }

  return new Promise<void>((resolve, reject) => {
    if (middleware.length === 0) {
      return resolve();
    }

    iteratee((err: Error) => err ? reject(err) : resolve());
  });
}
