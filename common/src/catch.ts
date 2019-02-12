/**
 * Catch error decorator
 * @param {Function} catchFn Function to handle error, accepts one argument - actual error
 */
export function Catch(catchFn: (...args) => void) {
  return function(_target, _key, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function(...args) {
      try {
        let value = originalMethod.apply(this, args);
        if (value !== undefined && value.catch) {
          value.catch(error => catchFn(...args, error));
        }
        return value;
      } catch (error) {
        catchFn(...args, error);
      }
    };

  };
}
