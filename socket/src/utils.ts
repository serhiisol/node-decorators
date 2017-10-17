import { SocketMeta, SocketIOClass, MiddlewareFunction } from './interface';

/**
 * Get or initiate metadata on target
 *
 * @param target
 *
 * @returns {SocketIOMeta}
 */
export function getMeta(target: SocketIOClass): SocketMeta {
  if (!target.__socket_meta__) {
    target.__socket_meta__ = new SocketMeta();
  }

  return target.__socket_meta__;
}

/**
 * Check middleware and return array of middlewares by default
 *
 * @export
 * @param {(MiddlewareFunction|MiddlewareFunction[])} fn
 *
 * @returns {MiddlewareFunction[]}
 */
export function prepareMiddleware(fn: MiddlewareFunction|MiddlewareFunction[]): MiddlewareFunction[] {
  if (typeof fn === 'function') {
    return [ fn ];
  } else if (Array.isArray(fn)) {
    return (<MiddlewareFunction[]>fn).filter(md => typeof md === 'function');
  }

  return [];
}

/**
 * Loops through all registered middlewares
 *
 * @description middleware approach
 * @param {MiddlewareFunction[]} fns Array of middleware functions
 * @param {any[]} [args = []] Arguments to pass in
 *
 * @returns {Promise<*>}
 */
export function loopFns(fns: MiddlewareFunction[], args: any[] = []): Promise<any> {
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
    } catch (e) {
      done(e);
    }

  }

  return new Promise((resolve, reject) => {

    if (!Array.isArray(fns) || !fns.length) {
      return resolve();
    }

    iteratee((err: Error) => err ? reject(err) : resolve());

  });
}

/**
 * Dummy empty function, to ensure that callback exists
 */
export function noop() {}
