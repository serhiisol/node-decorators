import { getMeta } from '../utils';

function makeRouteMeta(target: Object, key: string | symbol, descriptor: any, method: string, url: string) {
  let meta = getMeta(target);
  meta.routes[key] = <IRoute>{method, url};
  return descriptor;
}

let makeRoute = (method: string, url: string): MethodDecorator =>
  (target: Object, key: string | symbol, descriptor: any) => makeRouteMeta(target, key, descriptor, 'get', url);

export let Get = (url: string): MethodDecorator => makeRoute('get', url);

export let Post = (url: string): MethodDecorator => makeRoute('post', url);

export let Put = (url: string): MethodDecorator => makeRoute('put', url);

export let Delete = (url: string): MethodDecorator => makeRoute('delete', url);

export let Options = (url: string): MethodDecorator => makeRoute('options', url);
