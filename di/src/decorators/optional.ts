import { Type } from '../types';
import { Store } from '../store';

/**
 * Type of the Optional metadata.
 *
 * @export
 */
export function Optional(): ParameterDecorator {
  return function(target: Type, _key: string | symbol, index: number): void {
    Store.provider(target, { index, optional: true });
  };
}
