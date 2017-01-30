/**
 * Suppress console methods to be executed, prevents logs. Suppresses sync and async (promises) code. 
 * But be aware of possible side effects caused by promises, e.g. if promise will be unresolved,
 * SuppressConsole won't add methods back to console.
 * @param {string[]} methods Methods to be suppressed
 */
export function SuppressConsole(methods: string[] = ['log']) {
  return function SuppressConsole(target, key, descriptor) {

    const originalMethod = descriptor.value;
    const nativeMethods = methods.reduce((nativeMethods, method) => {
      nativeMethods[method] = console[method];
      return nativeMethods;
    }, {});
    const noop = function noop() {};

    function lock() {
      methods.forEach(method => {
        console[method] = noop;
      });
    }

    function unlock() {
      methods.forEach(method => {
        console[method] = nativeMethods[method];
      });
    }

    descriptor.value = function (...args) {
      lock();

      const result = originalMethod.apply(this, args);

      if (result.then) {
        result.then(unlock);
      } else {
        unlock();
      }

      return result;
    };
  }
}
