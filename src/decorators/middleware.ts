import { getMeta } from '../utils';

export let Middleware = (middleware: Function): MethodDecorator => {
  return (target: Object, propertyKey: string | symbol, descriptor: any) => {
    let meta = getMeta(target);
    if (!meta.middleware[propertyKey]) {
      meta.middleware[propertyKey] = [];
    }
    meta.middleware[propertyKey].push(middleware);
    return descriptor;
  }
};
