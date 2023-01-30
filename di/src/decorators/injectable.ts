import { Type } from '../types';
import { Store } from '../store';

/**
 * * Type of the Injectable metadata.
 */
export function Injectable() {
  return (target: Type) => Store.provider(target);
}
