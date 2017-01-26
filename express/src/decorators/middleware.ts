import { getMeta, getMiddleware } from '../meta';

/**
 * Registers route middleware
 * @deprecated
 * @param {Function|Function[]} [middleware]
 * @returns {(target:Function)=>void}
 * @constructor
 */
export let Middleware = (middleware: Function|Function[]): MethodDecorator => {
  return (target: ExpressClass, propertyKey: string | symbol, descriptor: any) => {
    console.warn('Deprecation: use route based middleware, @Middleware will be removed in 2.0.0, see doc -', target.constructor.name, propertyKey);

    let meta = getMeta(target);

    if (!meta.middleware[propertyKey]) {
      meta.middleware[propertyKey] = [];
    }

    meta.middleware[propertyKey].push(...getMiddleware(middleware));

    return descriptor;
  }
};
