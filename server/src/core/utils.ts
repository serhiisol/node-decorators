import { ClassConstructor, Handler } from './types';

export function addLeadingSlash(url: string): string {
  if (url.startsWith('/')) {
    return url;
  }

  return url ? `/${url}` : url;
}

export function buildUrl(...paths: string[]) {
  return paths
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

  if (!isNaN(Number(param)) && !isNaN(parseFloat(param as string))) {
    return parseFloat(param as string);
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
