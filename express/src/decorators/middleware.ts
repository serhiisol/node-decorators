import { getExpressMeta } from '../meta';

export let Middleware = (middleware: Function|Function[]): MethodDecorator => {
  return (target: ExpressClass, propertyKey: string | symbol, descriptor: any) => {
    let meta = getExpressMeta(target);
    let _middleware: Function[];

    if (!meta.middleware[propertyKey]) {
      meta.middleware[propertyKey] = [];
    }

    if (typeof middleware === 'function') {
      _middleware = [middleware];
    } else if (Array.isArray(middleware)){
      _middleware = (<Function[]>middleware).filter(md => typeof md === 'function');
    }

    meta.middleware[propertyKey].push(..._middleware);

    return descriptor;
  }
};
