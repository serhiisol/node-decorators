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
 * @param {Function} done
 */
export function loopFns(fns: Function[], done: (err?: Error) => void) {
  function iteratee(i = 0) {
    const fn = fns[i];

    try {
      fn((err, res) => {
        if (err) {
          return done(err);
        }

        if (i === fns.length - 1) {
          return done();
        }

        iteratee(++i);
      });
    } catch(e) {
      done(e);
    }

  }

  return iteratee();
}
