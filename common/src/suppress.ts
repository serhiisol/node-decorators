/**
 * Suppress console methods to be executed, prevents logs. Suppresses sync and async (promise) code.
 * @param {string[]} methods Methods to be suppressed
 */
export function SuppressConsole(methods: string[] = ['log']) {
  return function(_target, _key, descriptor) {
    const originalMethod = descriptor.value;
    const nativeMethods = methods.reduce((aggMethods, method) => {
      aggMethods[method] = console[method];
      return aggMethods;
    }, {});
    const noop = function noopFn() {};

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

    descriptor.value = function(...args) {
      lock();

      let result: any;
      try {
        result = originalMethod.apply(this, args);
      } catch (ex) {
        unlock();
        throw ex;
      }

      if (result.then) {
        return result.then(unlock, ex => {
          unlock();
          throw ex;
        });
      }

      unlock();
      return result;
    };
  };
}
