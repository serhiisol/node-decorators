/**
 * Catch error decorator
 * @param {Function} catchFn Function to handle error, accepts one argument - actual error
 */
export function Catch(catchFn: Function) {
  return function Catch(target, key, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      try {
        let value = originalMethod.apply(this, args);
        if (value !== undefined && value.catch) {
          value.catch(catchFn);
        }
        return value;
      } catch (error) {
        catchFn(error);
      }
    };

  }
}
