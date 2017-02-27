import { ExpressMeta, ExpressClass } from './interface';

/**
 * Get or initiate metadata on target
 * @param target
 * @returns {SocketIOMeta}
 */
export function getMeta(target: ExpressClass): ExpressMeta {
  if (!target.__meta__) {
    target.__meta__ = <ExpressMeta>{
      baseUrl: '',
      controllerMiddleware: [],
      routes: {},
      middleware: {},
      params: {}
    };
  }
  return <ExpressMeta>target.__meta__;
}

/**
 * Get array of given middleware
 */
export function getMiddleware(middleware: Function|Function[]): Function[] {
  if (typeof middleware === 'function') {
    return [middleware];
  } else if (Array.isArray(middleware)){
    return (<Function[]>middleware)
      .filter(md => typeof md === 'function');
  }
  return [];
}
