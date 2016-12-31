/**
 * Decorate class function with given function
 * @param {Function} decoratorFn Decorator function, accepts original function and other arguments, passed inside of Decorate decorator
 * @param {any[]} args All other arguments to pass inside of the decoratorFn
 * @description Decorator function should return new function which will be executed
 * function (originalMethod, ...args) {
 *  return function newFunctionToCall() => {
 *    //...
 *  }
 * }
 */
export function Decorate(decoratorFn: Function, ...args) {
  return function (target, key, descriptor) {

    const originalMethod = descriptor.value;

    descriptor.value = decoratorFn.apply(this, [originalMethod, ...args]);

  }
}