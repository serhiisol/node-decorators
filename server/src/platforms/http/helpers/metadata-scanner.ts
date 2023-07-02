import { Injectable } from '@decorators/di';

import { buildUrl, ClassConstructor, MethodMetadata, Reflector } from '../../../core';
import { RouteMetadata } from '../types';
import { METHOD_TEMPLATE_METADATA } from './constants';

@Injectable()
export class MetadataScanner {
  constructor(private reflector: Reflector) { }

  scan(module: ClassConstructor, parentNamespace = ''): RouteMetadata[] {
    const { controllers, modules, namespace } = this.reflector.getModuleMetadata(module);

    const routes = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);

      return metadata.methods.map((method: MethodMetadata) => {
        const template = this.reflector.getMetadata(METHOD_TEMPLATE_METADATA, controller.prototype[method.methodName]) as string;
        const params = metadata.params.filter(param => param.methodName === method.methodName);
        const pipes = metadata.pipes
          .filter(([, methodName]) => !methodName || methodName === method.methodName)
          .map(([pipe]) => pipe);

        return {
          ...method,
          controller,
          module,
          params,
          pipes,
          template,
          url: buildUrl(parentNamespace, namespace, metadata.url, method.url),
        } as RouteMetadata;
      });
    });

    const nestedRoutes = modules.map(module => this.scan(module, namespace));

    return [...nestedRoutes.flat(), ...routes.flat()];
  }
}
