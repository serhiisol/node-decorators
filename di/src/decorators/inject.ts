import { ClassConstructor, Injectable } from '../types';
import { DEP_IDS_METADATA } from '../constants';

export function Inject(injectable: Injectable) {
  return (target: ClassConstructor, _propertyKey: string | symbol, parameterIndex: number) => {
    const ids = Reflect.getMetadata(DEP_IDS_METADATA, target) ?? [];

    ids[parameterIndex] = injectable;

    Reflect.defineMetadata(DEP_IDS_METADATA, ids, target);
  };
}
