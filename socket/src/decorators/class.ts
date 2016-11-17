import { getMeta } from '../meta';

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
