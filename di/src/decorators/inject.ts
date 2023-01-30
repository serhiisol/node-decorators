import { Injectable, Type } from '../types';
import { Store } from '../store';

/**
 * Type of the Inject metadata.
 */
export function Inject(injectable: Injectable): ParameterDecorator {
  return (target: Type, _propertyKey, index: number) =>
    Store.provider(target, { index, injectable });
}
