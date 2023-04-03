import { Injectable } from '@decorators/di';

import { PIPES_METADATA, ProcessPipe } from '../helpers';
import { ClassConstructor } from '../types';

export function Pipe(pipe: ClassConstructor<ProcessPipe>) {
  return (target: ClassConstructor | InstanceType<any>, methodName?: string, descriptor?: any) => {
    const metaTarget = descriptor ? target.constructor : target;
    const pipes = Reflect.getMetadata(PIPES_METADATA, metaTarget) ?? [];
    const pipeMetadata = [pipe] as [ClassConstructor, string?];

    if (descriptor) {
      pipeMetadata.push(methodName);
    }

    pipes.unshift(pipeMetadata);

    Reflect.defineMetadata(PIPES_METADATA, pipes, metaTarget);

    if (!descriptor) {
      Injectable()(target);
    }

    return descriptor;
  };
}
