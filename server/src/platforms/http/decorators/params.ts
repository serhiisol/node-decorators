import { paramDecoratorFactory } from '../../../core';
import { ParameterType } from '../helpers';

export function Body(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.BODY });
}

export function Cookies(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.COOKIE });
}

export function Headers(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.HEADER });
}

export function Params(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.PARAM });
}

export function Query(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.QUERY });
}

export function Request(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.REQUEST });
}

export function Response(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.RESPONSE });
}
