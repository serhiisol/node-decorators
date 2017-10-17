import { SocketIOClass, SocketMeta, EventType, MiddlewareFunction } from '../interface';
import { getMeta, prepareMiddleware } from '../utils';

/**
 * Add listener to metadata
 *
 * @param target Target class
 * @param {string} key Function name
 * @param descriptor Function descriptor
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @param {MiddlewareFunction | MiddlewareFunction[]} middleware Event middleware
 */
function addListener(
  target: SocketIOClass,
  method: string | symbol,
  type: EventType,
  event: string,
  middleware: MiddlewareFunction | MiddlewareFunction[]
): void {
  const meta: SocketMeta = getMeta(target);

  meta.listeners.push({
    event,
    type,
    method,
    middleware: prepareMiddleware(middleware)
  });
}

/**
 * Listener decorator factory, creates listener decorator
 *
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @param {MiddlewareFunction | MiddlewareFunction[]} middleware Event middleware
 *
 * @returns {MethodDecorator}
 */
function makeDecorator(
  type: EventType,
  event: string,
  middleware?: MiddlewareFunction | MiddlewareFunction[]
): MethodDecorator {
  return (target: SocketIOClass, key: string | symbol, descriptor?: any) => {
    addListener(target, key, type, event, middleware);

    return descriptor;
  };
}

/**
 * Register **connection** event
 *
 * @see **io.on('connection', fn)**
 * @param {MiddlewareFunction | MiddlewareFunction[]} middleware Event middleware
 *
 * @returns {MethodDecorator}
 */
export function Connection(middleware?: MiddlewareFunction | MiddlewareFunction[]): MethodDecorator {
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
 * @param {string} event
 * @param {MiddlewareFunction | MiddlewareFunction[]} middleware Event middleware
 *
 * @returns {MethodDecorator}
 */
export function GlobalEvent(event: string, middleware?: MiddlewareFunction | MiddlewareFunction[]): MethodDecorator {
  return makeDecorator(EventType.IO, event, middleware);
}

/**
 * Registers **disconnect** listener
 *
 * @see **socket.on('disconnect', fn)**
 * @param {MiddlewareFunction | MiddlewareFunction[]} middleware Event middleware
 *
 * @returns {MethodDecorator}
 */
export function Disconnect(middleware?: MiddlewareFunction | MiddlewareFunction[]): MethodDecorator {
  return makeDecorator(EventType.Socket, 'disconnect', middleware);
}

/**
 * Registers socket event
 *
 * @see **socket.on**
 * @param {string} event
 * @param {Function | Function[]} middleware Event middleware
 *
 * @returns {MethodDecorator}
 */
export function Event(event: string, middleware?: MiddlewareFunction | MiddlewareFunction[]): MethodDecorator {
  return makeDecorator(EventType.Socket, event, middleware);
};
