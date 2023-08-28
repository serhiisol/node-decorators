import { ClassConstructor, MethodMetadata } from '../types';
import { addLeadingSlash, buildUrl } from '../utils';
import { Reflector } from './reflector';

export abstract class MetadataScanner<Metadata extends MethodMetadata> {
  constructor(
    private appVersion: string,
    protected rootModule: ClassConstructor,
    protected reflector: Reflector,
  ) { }

  scan() {
    return this.scanModule(this.rootModule);
  }

  protected abstract extractExtraMetadata(controller: ClassConstructor, method: Metadata): object;
  protected abstract filterMethod(method: Metadata): boolean;

  protected scanModule(module: ClassConstructor, parentNamespaces: string[] = []): Metadata[] {
    const { controllers, modules, namespace } = this.reflector.getModuleMetadata(module);
    const namespaces = [...parentNamespaces, namespace];

    const methods = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);
      const methods = metadata.methods.filter((method: Metadata) =>
        this.filterMethod(method),
      );

      return methods.map((method: Metadata) => {
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
          ...this.extractExtraMetadata(controller, method),
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
