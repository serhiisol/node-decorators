import { getMetadataStorage } from 'class-validator';

import { ClassConstructor, Handler } from '../../../../core';

export function typeToContentType(type: Handler | ClassConstructor) {
  return isObjectLike(type) ? 'application/json' : 'text/plain';
}

export function isStandardType(type: Handler | ClassConstructor) {
  const standardTypes = ['object', 'number', 'boolean', 'string'];

  return standardTypes.includes(type.name.toLowerCase());
}

export function replaceUrlParameters(url: string) {
  return url.replace(/:(\w+)/g, '{$1}');
}

export function isObjectLike(value: Handler | ClassConstructor) {
  return (typeof value === 'object' && value !== null) || value?.prototype.toString() === '[object Object]';
}

export function getValidationMeta(type: Handler | ClassConstructor) {
  const metadataStorage = getMetadataStorage();

  return metadataStorage.getTargetValidationMetadatas(type, null, null, null);
}

export function pick(obj: object, ...keys: string[]) {
  return keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});
}
