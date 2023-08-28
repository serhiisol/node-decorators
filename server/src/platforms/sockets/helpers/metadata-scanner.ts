import { Inject, Injectable, Optional } from '@decorators/di';

import { APP_VERSION, ClassConstructor, isEnum, MetadataScanner as MetaScanner, Reflector, ROOT_MODULE } from '../../../core';
import { EventMetadata } from '../types';
import { EventType } from './constants';

@Injectable()
export class MetadataScanner extends MetaScanner<EventMetadata> {
  constructor(
    @Inject(APP_VERSION) @Optional() appVersion: string,
    @Inject(ROOT_MODULE) rootModule: ClassConstructor,
    reflector: Reflector,
  ) {
    super(appVersion, rootModule, reflector);
  }

  protected extractExtraMetadata(_controller: ClassConstructor, _method: EventMetadata) {
    return {};
  }

  protected filterMethod(method: EventMetadata) {
    return isEnum(EventType, method.type);
  }
}
