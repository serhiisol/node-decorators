import { SocketIOClass, SocketIOMeta } from '../interface';
import { getMeta } from '../meta';

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
function addListenerMeta(
  target: SocketIOClass,
  key: string | symbol,
  descriptor: any,
  type: string,
  event: string,
  middleware: Function | Function[]
): Object {
  let meta: SocketIOMeta = getMeta(target);
  meta.listeners[type][key] = {
    event,
    middleware: typeof middleware === 'function' ? [middleware] : middleware || []
  };
  if (type === 'socket') {
    meta.listeners.all.push(event);
  }
  return descriptor;
}

/**
 * Listener decorator factory, creates listener decorator
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @param {Function | Function[]} middleware Event middleware
 */
let listenerDecoratorFactory = (type: string, event: string, middleware?: Function | Function[]): MethodDecorator => {
  return (target: SocketIOClass, key: string | symbol, descriptor?: any) => {
    return addListenerMeta(target, key, descriptor, type, event, middleware)
  };
};

/**
 * @alias {OnConnect}
 * @type {()=>MethodDecorator}
 */
export let Connection = (): MethodDecorator => listenerDecoratorFactory('io', 'connection');

/**
 * register **disconnect** listener (**socket.on('disconnect', fn)**)
 * @constructor
 */
export let Disconnect = (): MethodDecorator => listenerDecoratorFactory('socket', 'disconnect');

/**
 * Register global event (**io.on**)
 * @param {string} event
 * @constructor
 */
export let GlobalEvent = (event: string): MethodDecorator => listenerDecoratorFactory('io', event);

/**
 * Register socket event (**socket.on**);
 * @param {string} event
 * @param {Function | Function[]} middleware Event middleware
 * @constructor
 */
export let Event = (event: string, middleware?: Function | Function[]): MethodDecorator => listenerDecoratorFactory('socket', event, middleware);
