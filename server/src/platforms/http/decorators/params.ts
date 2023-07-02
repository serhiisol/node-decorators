import { paramDecoratorFactory } from '../../../core';
import { HttpParameterType } from '../helpers';

export function Request(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: HttpParameterType.REQUEST });
}

export function Response(paramName?: string) {
  return paramDecoratorFactory({ paramName, paramType: HttpParameterType.RESPONSE });
}
