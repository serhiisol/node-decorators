import { paramDecoratorFactory } from '../../../core';
import { ParameterType } from '../helpers';

export function Body(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.BODY });
}

export function Cookies(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.COOKIES });
}

export function Headers(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.HEADERS });
}

export function Params(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: ParameterType.PARAMS });
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
