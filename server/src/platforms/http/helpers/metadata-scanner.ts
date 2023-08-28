import { Inject, Injectable, Optional } from '@decorators/di';

import { APP_VERSION, ClassConstructor, isEnum, MetadataScanner as MetaScanner, Reflector, ROOT_MODULE } from '../../../core';
import { RouteMetadata } from '../types';
import { HttpMethodType, METHOD_TEMPLATE_METADATA } from './constants';

@Injectable()
export class MetadataScanner extends MetaScanner<RouteMetadata> {
  constructor(
    @Inject(APP_VERSION) @Optional() appVersion: string,
    @Inject(ROOT_MODULE) rootModule: ClassConstructor,
    reflector: Reflector,
  ) {
    super(appVersion, rootModule, reflector);
  }

  protected extractExtraMetadata(controller: ClassConstructor, method: RouteMetadata) {
    const params = this.reflector.getParamsMetadata(controller, method.methodName);
    const template = this.reflector.getMetadata(METHOD_TEMPLATE_METADATA, controller.prototype[method.methodName]);

    return { params, template };
  }

  protected filterMethod(method: RouteMetadata) {
    return isEnum(HttpMethodType, method.type);
  }
}
