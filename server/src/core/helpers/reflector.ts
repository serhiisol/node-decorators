import { Injectable } from '@decorators/di';

import { ClassConstructor, ControllerMetadata, MethodMetadata, ModuleMetadata, ParamMetadata } from '../types';
import { CONTROLLER_METADATA, METHOD_METADATA, MODULE_METADATA, PARAMS_METADATA, PIPES_METADATA } from './constants';

@Injectable()
export class Reflector {
  getControllerMetadata(controller: ClassConstructor) {
    const metadata = Reflect.getMetadata(CONTROLLER_METADATA, controller) as ControllerMetadata;
    const methods = (Reflect.getMetadata(METHOD_METADATA, controller) ?? []) as MethodMetadata[];
    const params = (Reflect.getMetadata(PARAMS_METADATA, controller) ?? []) as ParamMetadata[];
    const pipes = (Reflect.getMetadata(PIPES_METADATA, controller) ?? []) as [ClassConstructor, string?][];

    return { ...metadata, methods, params, pipes };
  }

  getMetadata(key: string, target: unknown, propertyKey?: string) {
    return Reflect.getMetadata(key, target, propertyKey);
  }

  getModuleMetadata(module: ClassConstructor) {
    return Reflect.getMetadata(MODULE_METADATA, module) as ModuleMetadata;
  }
}
