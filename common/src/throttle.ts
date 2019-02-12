export function Throttle(wait = 500) {
  return function throttled(_target, _key, descriptor) {
    const method = descriptor.value;
    let timeout;
    let last;

    descriptor.value = function(...args) {
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
