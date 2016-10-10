import { getMeta } from '../meta';
import { ParameterType } from '../interface';

function addParameterConfiguration(target: SocketIOClass, propertyKey: string | symbol, config: ParameterConfiguration) {
  let meta = getMeta(target);
  if (!meta.params[propertyKey]) {
    meta.params[propertyKey] = [];
  }
  meta.params[propertyKey].push(config);
}

function parameterDecoratorFactory(parameterType: ParameterType): (name?: string) => ParameterDecorator {
  return function(): ParameterDecorator {
    return function (target: SocketIOClass, propertyKey: string | symbol, index: number) {
      addParameterConfiguration(target, propertyKey, {index, type: parameterType});
    };
  };
}

export const IO = parameterDecoratorFactory(ParameterType.IO);
export const Socket = parameterDecoratorFactory(ParameterType.Socket);
export const Args = parameterDecoratorFactory(ParameterType.Args);
export const Callback = parameterDecoratorFactory(ParameterType.Callback);
