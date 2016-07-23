import { getExpressMeta } from '../../utils';
import { ParameterType } from '../interface';

function addParameterConfiguration(target: IDecoratedClass, propertyKey: string | symbol, config: IParameterConfiguration) {
  let meta = getExpressMeta(target);
  if (!meta.params[propertyKey]) {
    meta.params[propertyKey] = [];
  }
  meta.params[propertyKey].push(config);
}

function parameterDecoratorFactory(parameterType: ParameterType): (name?: string) => ParameterDecorator {
  return function(name?: string): ParameterDecorator {
    return function (target: IDecoratedClass, propertyKey: string | symbol, index: number) {
      addParameterConfiguration(target, propertyKey, {index, type: parameterType, name});
    };
  };
}

export const Request = parameterDecoratorFactory(ParameterType.REQUEST);
export const Response = parameterDecoratorFactory(ParameterType.RESPONSE);
export const Params = parameterDecoratorFactory(ParameterType.PARAMS);
export const Query = parameterDecoratorFactory(ParameterType.QUERY);
export const Body = parameterDecoratorFactory(ParameterType.BODY);
export const Headers = parameterDecoratorFactory(ParameterType.HEADERS);
export const Cookies = parameterDecoratorFactory(ParameterType.COOKIES);
