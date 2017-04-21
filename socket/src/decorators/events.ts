import { SocketIOClass, Meta, EventType } from '../interface';
import { getMeta } from '../meta';
import { prepareMiddleware } from '../utils';

/**
 * Add listener to metadata
 * @param target Target class
 * @param {string} key Function name
 * @param descriptor Function descriptor
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @param {Function | Function[]} middleware Event middleware
 * @returns {Object}
 */
function addListener(
  target: SocketIOClass,
  method: string | symbol,
  type: EventType,
  event: string,
  middleware: Function | Function[]
) {
  const meta: Meta = getMeta(target);

  meta.listeners.push({
    event,
    type,
    method,
    middleware: prepareMiddleware(middleware)
  });
}

/**
 * Listener decorator factory, creates listener decorator
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @param {Function | Function[]} middleware Event middleware
 */
function makeDecorator(
  type: EventType,
  event: string,
  middleware?: Function | Function[]
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
 * @param {Function | Function[]} middleware Event middleware
 */
export function Connection(middleware?: Function | Function[]): MethodDecorator {
  return makeDecorator(EventType.IO, 'connection', middleware);
}

/**
 * Registers global event
 *
 * @see **io.on**
 * @param {string} event
 * @param {Function | Function[]} middleware Event middleware
 */
export function GlobalEvent(event: string, middleware?: Function | Function[]): MethodDecorator {
  return makeDecorator(EventType.IO, event, middleware);
}

/**
 * Registers **disconnect** listener
 *
 * @see **socket.on('disconnect', fn)**
 * @param {Function | Function[]} middleware Event middleware
 */
export function Disconnect(middleware?: Function | Function[]): MethodDecorator {
  return makeDecorator(EventType.Socket, 'disconnect', middleware);
}

/**
 * Registers socket event
 *
 * @see **socket.on**
 * @param {string} event
 * @param {Function | Function[]} middleware Event middleware
 */
export function Event(event: string, middleware?: Function | Function[]): MethodDecorator {
  return makeDecorator(EventType.Socket, event, middleware);
};
