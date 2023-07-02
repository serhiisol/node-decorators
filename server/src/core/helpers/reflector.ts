import { Injectable } from '@decorators/di';

import { ClassConstructor, ControllerMetadata, MethodMetadata, ModuleMetadata, ParamMetadata } from '../types';
import { CONTROLLER_METADATA, METHOD_METADATA, MODULE_METADATA, PARAMS_METADATA, PIPES_METADATA } from './constants';

@Injectable()
export class Reflector {
  getControllerMetadata(controller: ClassConstructor) {
    const metadata = Reflect.getMetadata(CONTROLLER_METADATA, controller) as ControllerMetadata;
    const methods = (Reflect.getMetadata(METHOD_METADATA, controller) ?? []) as MethodMetadata[];
    const pipes = (Reflect.getMetadata(PIPES_METADATA, controller) ?? []) as [ClassConstructor, string?][];
    const params = (Reflect.getMetadata(PARAMS_METADATA, controller) ?? []) as ParamMetadata[];

    return { ...metadata, methods, pipes, params };
  }

  getMetadata(key: string, target: unknown) {
    return Reflect.getMetadata(key, target);
  }

  getModuleMetadata(module: ClassConstructor) {
    return Reflect.getMetadata(MODULE_METADATA, module) as ModuleMetadata;
  }
}
