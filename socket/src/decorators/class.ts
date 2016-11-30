import { getMeta } from '../meta';

/**
 * Defines namespace for the controller
 * @param {string} namespace
 */
export let Namespace = (namespace: string): ClassDecorator => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.namespace = namespace;
  }
};

/**
 * Registers global middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let ServerMiddleware = (fn: Function): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.middleware.io.push(fn);
  }
};

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let GlobalMiddleware = (fn: Function): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.middleware.socket.push(fn);
  }
};

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Middleware = (fn: Function): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.middleware.controller.push(fn);
  }
};
