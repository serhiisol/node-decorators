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

  private scanModule(module: ClassConstructor, parentNamespaces: string[] = []): RouteMetadata[] {
    const { controllers, modules, namespace } = this.reflector.getModuleMetadata(module);

    const routes = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);
      const methods = metadata.methods
        .filter((method: MethodMetadata) => isEnum(HttpMethodType, method.type));

      return methods.map((method: MethodMetadata) => {
        const template = this.reflector.getMetadata(METHOD_TEMPLATE_METADATA, controller.prototype[method.methodName]) as string;
        const params = this.reflector.getParamsMetadata(controller.prototype[method.methodName]);
        const pipes = metadata.pipes
          .filter(([, methodName]) => !methodName || methodName === method.methodName)
          .map(([pipe]) => pipe);

        const version = metadata.options?.ignoreVersion || !this.appVersion ? '' : this.appVersion;
        const paths = [version, ...parentNamespaces, namespace, metadata.url, method.url].filter(Boolean);
        const url = addLeadingSlash(buildUrl(...paths));

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

    const nestedRoutes = modules.map(module => this.scanModule(module, [...parentNamespaces, namespace]));

    return [...nestedRoutes.flat(), ...routes.flat()];
  }
}
