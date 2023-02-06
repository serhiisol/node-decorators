import { ClassConstructor } from '../types';
import { OPTIONAL_DEPS_METADATA } from '../constants';

export function Optional() {
  return (target: ClassConstructor, _propertyKey: string | symbol, parameterIndex: number) => {
    const optionals = Reflect.getMetadata(OPTIONAL_DEPS_METADATA, target) ?? [];

    optionals[parameterIndex] = true;

    Reflect.defineMetadata(OPTIONAL_DEPS_METADATA, optionals, target);
  };
}
