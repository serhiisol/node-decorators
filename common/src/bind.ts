function bind(fn, ctx) {
  if (fn.bind) {
    return fn.bind(ctx);
  }
  return function bind(...args) {
    return fn.apply(ctx, args);
  };
}

export function Bind(context ? : any) {
  return function Bind(target, key, descriptor: PropertyDescriptor) {
    const { configurable, enumerable, set } = descriptor;
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
      set(value: Function) {
        method = value;
      }
    };
  }
}
