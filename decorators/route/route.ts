import { getMeta } from '../utils';

function makeRouteMeta(target: any, key: string, descriptor: any, method: string, url: string) {
  let meta = getMeta(target);
  meta.routes[key] = {method, url};
  return descriptor;
}

function makeRoute(method, url: string) {
  return (target, key, descriptor) => makeRouteMeta(target, key, descriptor, 'get', url);
}

export let Route = (method: string, url: string) => makeRoute(method, url);

export let RouteGet = (url: string) => makeRoute('get', url);

export let RoutePost = (url: string) => makeRoute('post', url);

export let RoutePut = (url: string) => makeRoute('put', url);

export let RouteDelete = (url: string) => makeRoute('delete', url);

export let RouteOptions = (url: string) => makeRoute('options', url);
