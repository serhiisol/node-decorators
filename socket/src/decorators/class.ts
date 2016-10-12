import { getMeta } from '../meta';

/**
 * Creates server with options
 * @param {number | string | Object} serverOrPort
 * @param {Object} options
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Connect = (serverOrPort: any, options?: any): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.serverOrPort = serverOrPort;
    meta.options = options;
  }
};

/**
 * Registers middleware
 * @param {Function} fn
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Middleware = (fn: Function): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.middleware.push(fn);
  }
};
