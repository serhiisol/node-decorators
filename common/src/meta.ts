import { CommonClass, CommonMeta } from './interface';

/**
 * Get or initiate metadata on target
 * @param target
 * @returns {CommonMeta}
 */
export function getMeta(target: CommonClass): CommonMeta {
  if (!target.__meta__) {
    target.__meta__ = <CommonMeta> {
      parameters: {}
    };
  }

  return <CommonMeta>target.__meta__;
}


