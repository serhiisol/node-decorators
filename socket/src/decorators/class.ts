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
 * @param {Function|Function[]} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let ServerMiddleware = (fn: Function|Function[]): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    let middleware: Function[];

    if (typeof fn === 'function') {
      middleware = [fn];
    } else if (Array.isArray(fn)){
      middleware = (<Function[]>fn).filter(md => typeof md === 'function');
    }

    meta.middleware.io.push(...middleware);
  }
};

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let GlobalMiddleware = (fn: Function|Function[]): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    let middleware: Function[];

    if (typeof fn === 'function') {
      middleware = [fn];
    } else if (Array.isArray(fn)){
      middleware = (<Function[]>fn).filter(md => typeof md === 'function');
    }

    meta.middleware.socket.push(...middleware);
  }
};

/**
 * Registers socket middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Middleware = (fn: Function|Function[]): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    let middleware: Function[];

    if (typeof fn === 'function') {
      middleware = [fn];
    } else if (Array.isArray(fn)){
      middleware = (<Function[]>fn).filter(md => typeof md === 'function');
    }

    meta.middleware.controller.push(...middleware);
  }
};
