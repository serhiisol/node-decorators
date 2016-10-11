import { getMeta } from '../meta';

/**
 * Add listener to metadata
 * @param target Target class
 * @param {string} key Function name
 * @param descriptor Function descriptor
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @returns {any}
 */
function addListenerMeta(target: SocketIOClass, key: string | symbol, descriptor: any, type: string, event: string) {
  let meta: SocketIOMeta = getMeta(target);
  meta.listeners[type][key] = event;
  return descriptor;
}

/**
 * Listener decorator factory, creates listener decorator
 * @param {string} type Listener type: io or socket
 * @param {string} event Event name
 * @returns {(target:SocketIOClass, key:(string|symbol), descriptor?:any)=>any}
 */
let listenerDecoratorFactory = (type: string, event: string): MethodDecorator => {
  return (target: SocketIOClass, key: string | symbol, descriptor?: any) => {
    return addListenerMeta(target, key, descriptor, type, event)
  };
}

/**
 * Register global event (**io.on**)
 * @param {string} event
 * @constructor
 */
export let OnIO = (event: string): MethodDecorator => listenerDecoratorFactory('io', event);

/**
 * register **connection** listener (**io.on('connection', fn)**)
 * @constructor
 */
export let OnConnect = (): MethodDecorator => listenerDecoratorFactory('io', 'connection');

/**
 * @alias {OnConnect}
 * @type {()=>MethodDecorator}
 */
export let OnConnection = OnConnect;

/**
 * Register socket event (**socket.on**);
 * @param {string} event
 * @constructor
 */
export let OnSocket = (event: string): MethodDecorator => listenerDecoratorFactory('socket', event);
