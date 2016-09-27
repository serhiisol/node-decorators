import { getExpressMeta } from '../meta';

export let Middleware = (middleware: Function): MethodDecorator => {
  return (target: ExpressClass, propertyKey: string | symbol, descriptor: any) => {
    let meta = getExpressMeta(target);
    if (!meta.middleware[propertyKey]) {
      meta.middleware[propertyKey] = [];
    }
    meta.middleware[propertyKey].push(middleware);
    return descriptor;
  }
};
