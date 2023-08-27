import { paramDecoratorFactory, Validator } from '../../../core';
import { ParameterType } from '../helpers';

export function Param(paramValidator?: Validator) {
  return paramDecoratorFactory({
    paramType: ParameterType.PARAM,
    paramValidator,
  });
}

export function Server() {
  return paramDecoratorFactory({
    paramType: ParameterType.SERVER,
  });
}

export function Socket() {
  return paramDecoratorFactory({
    paramType: ParameterType.SOCKET,
  });
}
