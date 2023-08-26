import { Inject, Injectable, Optional } from '@decorators/di';

import { addLeadingSlash, APP_VERSION, buildUrl, ClassConstructor, isEnum, Reflector, ROOT_MODULE } from '../../../core';
import { EventMetadata } from '../types';
import { EventType } from './constants';

@Injectable()
export class MetadataScanner {
  constructor(
    @Inject(APP_VERSION) @Optional() private appVersion: string,
    @Inject(ROOT_MODULE) private rootModule: ClassConstructor,
    private reflector: Reflector,
  ) { }

  scan() {
    return this.scanModule(this.rootModule);
  }

  private scanModule(module: ClassConstructor, parentNamespaces: string[] = []): EventMetadata[] {
    const { controllers, modules, namespace } = this.reflector.getModuleMetadata(module);

    const events = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);
      const methods = metadata.methods
        .filter((method: EventMetadata) => isEnum(EventType, method.type));

      return methods.map((method: EventMetadata) => {
        const params = metadata.params.filter(param => param.methodName === method.methodName);
        const pipes = metadata.pipes
          .filter(([, methodName]) => !methodName || methodName === method.methodName)
          .map(([pipe]) => pipe);

        const version = metadata.options?.ignoreVersion || !this.appVersion ? '' : this.appVersion;
        const paths = [version, ...parentNamespaces, namespace, metadata.url].filter(Boolean);
        const url = addLeadingSlash(buildUrl(...paths));

        return {
          ...method,
          controller,
          module,
          params,
          paths,
          pipes,
          url,
        } as EventMetadata;
      });
    });

    const nestedEvents = modules.map(module => this.scanModule(module, [...parentNamespaces, namespace]));

    return [...nestedEvents.flat(), ...events.flat()];
  }
}
