function bind(fn, ctx) {
  if (fn.bind) {
    return fn.bind(ctx);
  }
  return function(...args) {
    return fn.apply(ctx, args);
  };
}

export function Bind(context?: any) {
  return function(_target, _key, descriptor: PropertyDescriptor) {
    const { configurable, enumerable } = descriptor;
    let method = descriptor.value;

    if (typeof method !== 'function') {
      throw new Error('@Bind can be applied to functions only');
    }

    return {
      configurable,
      enumerable,

      get() {
        return bind(method, context || this);
      },
      set(value) {
        method = value;
      }
    };
  };
}
