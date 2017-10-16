import { Type } from '../types';
import { Store } from '../store';

/**
 * * Type of the Injectable metadata.
 *
 * @export
 */
export function Injectable() {
  return function(target: Type): Type {
    return Store.provider(target);
  };
};
