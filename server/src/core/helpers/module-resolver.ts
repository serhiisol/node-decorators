import { Container, Injectable } from '@decorators/di';

import { ClassConstructor } from '../types';
import { ContainerManager } from './container-manager';
import { Reflector } from './reflector';

@Injectable()
export class ModuleResolver {
  constructor(
    private containerManager: ContainerManager,
    private reflector: Reflector,
  ) { }

  prepareModule(module: ClassConstructor, parentContainer: Container) {
    const metadata = this.reflector.getModuleMetadata(module);
    const container = this.containerManager.create(module);

    container.setParent(parentContainer);

    metadata.providers.forEach(provider => {
      const providerContainer = parentContainer.has(provider.provide) ? container : parentContainer;

      providerContainer.provide([provider]);
    });

    const localProviders = metadata.controllers.map(controller => {
      const metadata = this.reflector.getControllerMetadata(controller);
      const pipes = metadata.pipes.map(([pipe]) => ({ provide: pipe, useClass: pipe }));

      return [...pipes, { provide: controller, useClass: controller }];
    });

    container.provide([
      ...localProviders.flat(),
      {
        provide: module,
        useClass: module,
      },
    ]);

    for (const module of metadata.modules) {
      this.prepareModule(module, container);
    }
  }

  async resolveModule(module: ClassConstructor) {
    const metadata = this.reflector.getModuleMetadata(module);

    for (const child of metadata.modules) {
      await this.resolveModule(child);
    }

    await this.containerManager.get(module).get(module);
  }
}
