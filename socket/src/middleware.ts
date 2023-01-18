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
export function middlewareHandler(
  middleware: Middleware | InjectionToken,
  args: Parameters<MiddlewareFunction> | Parameters<ServerMiddlewareFunction>
) {
  const next = args[args.length - 1] as NextFunction;
  let instance: InstanceType<Type<MiddlewareClass | ServerMiddlewareClass>>;

  try {
    instance = Container.get(middleware);
  } catch {
    if (typeof instance !== 'function') {
      next();

      return;
    }

    try {
      instance = new (middleware as Type<MiddlewareClass | ServerMiddlewareClass>)(...args);
    } catch (err) {
      next(err as Error);

      return;
    }
  }

  try {
    const handler = instance.use ?? instance;
    const result = typeof handler === 'function' ? handler.apply(instance, args) : instance;

    if (result instanceof Promise) {
      result.catch(next);
    }
  } catch (e) {
    next(e as Error);
  }
}

/**
 * Loops through all registered middlewares
 */
export function executeMiddleware(middleware: Middleware[], args: unknown[] = []): Promise<any> {
  function iteratee(done: (err?: Error) => void, i = 0) {
    try {
      middlewareHandler(middleware[i], [...args, (err?: Error) => {
        if (err) {
          done(err);
        } else if (i === middleware.length - 1) {
          done();
        } else {
          iteratee(done, ++i);
        }
      }] as Parameters<MiddlewareFunction> | Parameters<ServerMiddlewareFunction>);
    } catch (e) {
      done(e as Error);
    }
  }

  return new Promise<void>((resolve, reject) => {
    if (middleware === undefined || middleware.length === 0) {
      return resolve();
    }

    iteratee((err: Error) => err ? reject(err) : resolve());
  });
}
