import { Type } from '../types';
import { Store } from '../store';

/**
 * Type of the Optional metadata.
 */
export function Optional(): ParameterDecorator {
  return (target: Type, _key: string | symbol, index: number) =>
    Store.provider(target, { index, optional: true });
}
