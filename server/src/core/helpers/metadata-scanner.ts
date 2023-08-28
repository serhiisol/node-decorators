import { Inject, Injectable, Optional } from '@decorators/di';

import { ClassConstructor, Metadata, MethodMetadata } from '../types';
import { addLeadingSlash, buildUrl } from '../utils';
import { APP_VERSION, ROOT_MODULE } from './constants';
import { Reflector } from './reflector';

@Injectable()
export class MetadataScanner {
  constructor(
    @Inject(APP_VERSION) @Optional() private appVersion: string,
    @Inject(ROOT_MODULE) private rootModule: ClassConstructor,
    private reflector: Reflector,
  ) { }

  scan<M extends Metadata>() {
    return this.scanModule(this.rootModule) as M[];
  }

  private scanModule(module: ClassConstructor, parentNamespaces: string[] = []): MethodMetadata[] {
    const { controllers, modules, namespace } = this.reflector.getModuleMetadata(module);
    const namespaces = [...parentNamespaces, namespace];

    const methods = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);

      return metadata.methods.map((method: MethodMetadata) => {
        const params = this.reflector.getParamsMetadata(controller, method.methodName);

        const pipes = metadata.pipes
          .filter(([, methodName]) => !methodName || methodName === method.methodName)
          .map(([pipe]) => pipe);

        const version = metadata.options?.ignoreVersion || !this.appVersion ? '' : this.appVersion;
        const paths = [version, ...namespaces, metadata.url, method.url].filter(Boolean);
        const url = addLeadingSlash(buildUrl(...paths));

        return {
          ...method,
          controller,
          module,
          params,
          paths,
          pipes,
          url,
        } as Metadata;
      });
    });

    const nestedMethods = modules.map(module =>
      this.scanModule(module, namespaces),
    );

    return [
      ...nestedMethods.flat(),
      ...methods.flat(),
    ];
  }
}
