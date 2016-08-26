import { co } from 'co';

export let Async = (target: any, propertyKey: string | symbol, descriptor: any) => {
  let method = descriptor.value;

  descriptor.value = function (...args) {
    return co(function *() {
      return yield method.apply(this, args);
    });
  };

  return descriptor;
};
