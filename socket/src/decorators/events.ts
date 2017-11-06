import { getMeta, SocketClass, SocketMeta, EventType } from '../meta';
import { Middleware } from '../middleware';

/**
 * Listener decorator factory, creates listener decorator
 *
 * @param {EventType} type Listener type: io or socket
 * @param {string} event Event name
 * @param {Middleware[]} middleware Event middleware
 */
function makeDecorator(type: EventType, event: string, middleware?: Middleware[]) {
  return (target: SocketClass, methodName: string, descriptor?: any) => {
    const meta: SocketMeta = getMeta(target);

    meta.listeners.push({ event, type, middleware, methodName });

    return descriptor;
  };
}

/**
 * Register **connection** event
 *
 * @see **io.on('connection', fn)**
 *
 * @param {Middleware[]} middleware Event middleware
 */
export function Connection(middleware?: Middleware[]) {
  return makeDecorator(EventType.IO, 'connection', middleware);
}
/**
 * @alias {Connection}
 */
export const Connect = Connection;

/**
 * Registers global event
 *
 * @see **io.on**
 *
 * @param {string} event
 * @param {Middleware[]} middleware Event middleware
 */
export function GlobalEvent(event: string, middleware?: Middleware[]) {
  return makeDecorator(EventType.IO, event, middleware);
}

/**
 * Registers **disconnect** listener
 *
 * @see **socket.on('disconnect', fn)**
 *
 * @param {Middleware[]} middleware Event middleware
 */
export function Disconnect(middleware?: Middleware[]) {
  return makeDecorator(EventType.Socket, 'disconnect', middleware);
}

/**
 * Registers socket event
 *
 * @see **socket.on**
 *
 * @param {string} event
 * @param {Middleware[]} middleware Event middleware
 */
export function Event(event: string, middleware?: Middleware[]) {
  return makeDecorator(EventType.Socket, event, middleware);
};
