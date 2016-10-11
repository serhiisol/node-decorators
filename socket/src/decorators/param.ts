import { getMeta } from '../meta';
import { ParameterType } from '../interface';

/**
 * Add parameter to metadata
 * @param target Target Class
 * @param propertyKey Function name, parameters owner
 * @param { {index: number, type: number} } config Parameter configuration
 */
function addParameterMeta(target: SocketIOClass, propertyKey: string | symbol, config: ParameterConfiguration) {
  let meta = getMeta(target);
  if (!meta.params[propertyKey]) {
    meta.params[propertyKey] = [];
  }
  meta.params[propertyKey].push(config);
}

/**
 * Parameter decorator factory, creates parameter decorator
 * @param parameterType Parameter Type
 * @returns {()=>ParameterDecorator}
 */
function parameterDecoratorFactory(parameterType: ParameterType): (name?: string) => ParameterDecorator {
  return function(): ParameterDecorator {
    return function (target: SocketIOClass, propertyKey: string | symbol, index: number) {
      addParameterMeta(target, propertyKey, {index, type: parameterType});
    };
  };
}

/**
 * Returns server itself
 * @type {(name?:string)=>ParameterDecorator}
 */
export const IO = parameterDecoratorFactory(ParameterType.IO);

/**
 * Returns socket
 * @type {(name?:string)=>ParameterDecorator}
 */
export const Socket = parameterDecoratorFactory(ParameterType.Socket);

/**
 * Returns event arguments (excluding callback)(if it exists)
 * @type {(name?:string)=>ParameterDecorator}
 */
export const Args = parameterDecoratorFactory(ParameterType.Args);

/**
 * Returns callback function (if it exists)
 * @type {(name?:string)=>ParameterDecorator}
 */
export const Callback = parameterDecoratorFactory(ParameterType.Callback);
