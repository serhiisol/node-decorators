import { extractParamNames } from '../utils';
import { METHOD_METADATA, PARAM_TYPE_METADATA, PARAMS_METADATA } from './constants';
import { Context } from './context';

export function paramDecoratorFactory(metadata: object) {
  return function (target: InstanceType<any>, methodName: string, index: number) {
    const params = Reflect.getMetadata(PARAMS_METADATA, target.constructor) ?? [];
    const validator = Reflect.getMetadata(PARAM_TYPE_METADATA, target, methodName)[index];
    const paramName = extractParamNames(target[methodName])[index];

    params.push({ index, methodName, paramName, validator, ...metadata });

    Reflect.defineMetadata(PARAMS_METADATA, params, target.constructor);
  };
}

export function methodDecoratorFactory(metadata: object) {
  return (target: object, methodName: string, descriptor: TypedPropertyDescriptor<any>) => {
    const routes = Reflect.getMetadata(METHOD_METADATA, target.constructor) ?? [];

    routes.push({ methodName, ...metadata });

    Reflect.defineMetadata(METHOD_METADATA, routes, target.constructor);

    return descriptor;
  };
}

/**
 * Creates a custom parameter decorator
 *
 * Example:
 *
 * ...
 * export function AccessParam() {
 *   return createParamDecorator((context: HttpContext) => {
 *     const req = context.getRequest<Request>();
 *
 *     return req.query.access;
 *  });
 * }
 *
 * ...
 * authorize(@AccessParam() access: string)
 * ...
 */
export function createParamDecorator(factory: (context: Context) => unknown) {
  return paramDecoratorFactory({ factory });
}

/**
 * Creates a custom method or class decorator
 *
 * Example:
 *
 * ...
 * export function Access(access: string) {
 *   return Decorate('access', access);
 * }
 * ...
 *
 * @Access('granted')
 * create()
 * ...
 *
 * Also can be used without a wrapper:
 *
 * ...
 * @Decorate('access', granted)
 * create()
 * ...
 */
export function Decorate(key: string, value: unknown) {
  return (target: object, _?: any, descriptor?: any) => {
    const metaTarget = descriptor?.value ?? target;

    Reflect.defineMetadata(key, value, metaTarget);

    return descriptor ?? target;
  };
}
