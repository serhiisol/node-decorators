import { Handler } from './types';

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

  if (!isNaN(Number(param))) {
    return Number(param);
  }

  return param;
}

export function extractParamNames(handler: Handler) {
  return /\(\s*([^)]+?)\s*\)/
    .exec(handler.toString())[1]
    .split(',');
}
