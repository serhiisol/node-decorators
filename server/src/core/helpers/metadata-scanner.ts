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

    const events = controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);
      const methods = metadata.methods.filter((method: Metadata) => this.filterMethod(method));

      return methods.map((method: Metadata) => {
        const params = this.reflector.getParamsMetadata(controller, method.methodName);

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
          paths,
          pipes,
          url,
          ...this.extractExtraMetadata(controller, method),
        } as Metadata;
      });
    });

    const nestedEvents = modules.map(module => this.scanModule(module, [...parentNamespaces, namespace]));

    return [...nestedEvents.flat(), ...events.flat()];
  }
}
