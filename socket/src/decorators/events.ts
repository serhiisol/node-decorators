import { getMeta, EventType } from '../meta';
import { Middleware } from '../middleware';

/**
 * Register **connection** event
 */
export function Connection(middleware?: Middleware[]) {
  return decoratorFactory(EventType.IO, 'connection', middleware);
}
/**
 * @alias {Connection}
 */
export const Connect = Connection;

/**
 * Registers global event
 */
export function GlobalEvent(event: string, middleware?: Middleware[]) {
  return decoratorFactory(EventType.IO, event, middleware);
}

/**
 * Registers **disconnect** listener
 */
export function Disconnect(middleware?: Middleware[]) {
  return decoratorFactory(EventType.Socket, 'disconnect', middleware);
}

/**
 * Registers socket event
 */
export function Event(event: string, middleware?: Middleware[]) {
  return decoratorFactory(EventType.Socket, event, middleware);
}

/**
 * Listener decorator factory, creates listener decorator
 */
function decoratorFactory(type: EventType, event: string, middleware: Middleware[] = []): MethodDecorator {
  return (target: object, methodName: string, descriptor?: any) => {
    const meta = getMeta(target);

    meta.listeners.push({ event, type, middleware, methodName });

    return descriptor;
  };
}
