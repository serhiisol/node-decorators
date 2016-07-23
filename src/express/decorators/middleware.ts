import { getExpressMeta } from '../../utils';

export let Middleware = (middleware: Function): MethodDecorator => {
  return (target: IDecoratedClass, propertyKey: string | symbol, descriptor: any) => {
    let meta = getExpressMeta(target);
    if (!meta.middleware[propertyKey]) {
      meta.middleware[propertyKey] = [];
    }
    meta.middleware[propertyKey].push(middleware);
    return descriptor;
  }
};
