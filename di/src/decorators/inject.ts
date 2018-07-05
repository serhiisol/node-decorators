import { Injectable, Type } from '../types';
import { Store } from '../store';

/**
 * Type of the Inject metadata.
 *
 * @export
 * @param {Injectable} injectable
 */
export function Inject(injectable: Injectable): ParameterDecorator {
  return function(target: Type, _propertyKey, index: number): void {
    Store.provider(target, { index, injectable });
  };
}
