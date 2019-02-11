export function Debounce(wait = 500) {
  return function(_target, _key, descriptor) {
    let func = descriptor.value;
    let timeout;

    descriptor.value = function(...args) {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait);

    };

    return descriptor;
  };
}
