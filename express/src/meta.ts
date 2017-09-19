import { ExpressMeta, ExpressClass } from './interface';

/**
 * Get or initiate metadata on target
 * @param target
 * @returns {SocketIOMeta}
 */
export function getMeta(target: ExpressClass): ExpressMeta {
  if (!target.__express_meta__) {
    target.__express_meta__ = {
      baseUrl: '',
      controllerMiddleware: [],
      routes: {},
      middleware: {},
      params: {}
    };
  }
  return target.__express_meta__;
}

/**
 * Get array of given middleware
 */
export function getMiddleware(middleware: Function|Function[]): Function[] {
  if (Array.isArray(middleware)) {
    return (<Function[]>middleware)
      .filter(md => typeof md === 'function');
  } else if (typeof middleware === 'function') {
    return [middleware];
  }

  return [];
}
