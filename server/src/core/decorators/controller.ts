import { Injectable } from '@decorators/di';

import { CONTROLLER_METADATA } from '../helpers';
import { ClassConstructor } from '../types';

export function Controller(url = '', options?: Record<string, unknown>) {
  return (target: ClassConstructor) => {
    Reflect.defineMetadata(CONTROLLER_METADATA, { options, url }, target);

    Injectable()(target);
  };
}
