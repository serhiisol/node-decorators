import { ClassConstructor, Handler } from './types';

export function addLeadingSlash(url: string): string {
  return url.startsWith('/') ? url : `/${url}`;
}

export function buildUrl(...paths: string[]) {
  return paths
    .filter(Boolean)
    .map(path => path.startsWith('/') ? path.slice(1) : path)
    .filter(Boolean)
    .join('/');
}

export function asyncMap<T>(iterables: unknown[], func: (iterable: unknown, i?: number) => Promise<T>): Promise<T[]> {
  return Promise.all(iterables.map(func));
}

export function toStandardType(param: unknown) {
  if (param === 'false' || param === 'true') {
    return param === 'true';
  }

  if (typeof param === 'string' && !isNaN(Number(param)) && !isNaN(parseFloat(param))) {
    return parseFloat(param);
  }

  return param;
}

export function extractParamNames(handler: Handler) {
  return /\(\s*([^)]+?)\s*\)/
    .exec(handler.toString())[1]
    .split(',')
    .map(key => key.trim());
}

export function isClass(type: Handler | ClassConstructor) {
  return typeof type === 'function' && type.toString().startsWith('class');
}

export function isFunction(type: Handler | ClassConstructor) {
  return typeof type === 'function' && !isClass(type);
}

export function isEnum(type: object, val: unknown) {
  return Object.values(type).includes(val);
}
