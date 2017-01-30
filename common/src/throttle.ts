export function Throttle(wait = 500) {
  return function throttled(target, key, descriptor) {
    let method = descriptor.value, timeout, last;

    descriptor.value = function (...args) {
      const now = Date.now();

      if (last && now < last + wait) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          last = now;
          method.apply(this, args);
        }, wait);

      } else {
        last = now;
        method.apply(this, args);
      }

    };

    return descriptor;
  };
}
