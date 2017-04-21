/**
 * Check middleware and return array of middlewares by default
 *
 * @export
 * @param {(Function|Function[])} fn
 * @returns {Function[]}
 */
export function prepareMiddleware(fn: Function|Function[]): Function[] {
  if (typeof fn === 'function') {
    return [ fn ];
  } else if (Array.isArray(fn)) {
    return (<Function[]>fn).filter(md => typeof md === 'function');
  }

  return [];
}

/**
 * Dummy empty function, to ensure that callback exists
 */
export function noop() {}
