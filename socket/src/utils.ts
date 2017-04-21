import { Meta, SocketIOClass } from './interface';

/**
 * Get or initiate metadata on target
 * @param target
 * @returns {SocketIOMeta}
 */
export function getMeta(target: SocketIOClass): Meta {
  if (!target.__socket_meta__) {
    target.__socket_meta__ = new Meta();
  }

  return target.__socket_meta__;
}

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

/**
 * Custom functions loop
 *
 * @description middleware approach
 * @param {Function[]} fns
 * @param {any[]} args Arguments to pass in
 * @returns {Promise<any>}
 */
export function loopFns(fns: Function[], args: any[]): Promise<any> {
  function iteratee(done: (err: Error) => void, i = 0) {
    const fn = fns[i];

    try {
      fn(...args, (err, res) => {
        if (err) {
          return done(err);
        }

        if (i === fns.length - 1) {
          return done(null);
        }

        iteratee(done, ++i);
      });
    } catch(e) {
      done(e);
    }

  }

  return new Promise((resolve, reject) => {
    iteratee((err: Error) => err ? reject(err) : resolve());
  });
}
