import { Inject, Injectable, Optional } from '@decorators/di';

import { addLeadingSlash, APP_VERSION, buildUrl, ClassConstructor, isEnum, MethodMetadata, Reflector, ROOT_MODULE } from '../../../core';
import { RouteMetadata } from '../types';
import { HttpMethodType, METHOD_TEMPLATE_METADATA } from './constants';

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

  private scanModule(module: ClassConstructor, parentNamespace = ''): RouteMetadata[] {
    const { controllers, modules, namespace } = this.reflector.getModuleMetadata(module);

    const routes = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);
      const methods = metadata.methods
        .filter((method: MethodMetadata) => isEnum(HttpMethodType, method.type));

      return methods.map((method: MethodMetadata) => {
        const template = this.reflector.getMetadata(METHOD_TEMPLATE_METADATA, controller.prototype[method.methodName]) as string;
        const params = metadata.params.filter(param => param.methodName === method.methodName);
        const pipes = metadata.pipes
          .filter(([, methodName]) => !methodName || methodName === method.methodName)
          .map(([pipe]) => pipe);

        const version = metadata.options?.ignoreVersion || !this.appVersion ? '' : this.appVersion;
        const url = addLeadingSlash(buildUrl(version, parentNamespace, namespace, metadata.url, method.url));

        return {
          ...method,
          controller,
          module,
          params,
          pipes,
          template,
          url,
        } as RouteMetadata;
      });
    });

    const nestedRoutes = modules.map(module => this.scanModule(module, namespace));

    return [...nestedRoutes.flat(), ...routes.flat()];
  }
}
