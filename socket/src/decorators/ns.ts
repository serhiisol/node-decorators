import { Meta } from '../interface';
import { getMeta } from '../meta';

/**
 * Defines namespace for the controller
 *
 * @param {string} ns
 */
export const Namespace = (ns: string): ClassDecorator => {
  return (target: Function): void => {
    const meta: Meta = getMeta(target.prototype);

    meta.ns = ns;
  };
};
