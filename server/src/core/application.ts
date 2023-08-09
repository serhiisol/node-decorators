import { InjectionToken, RootContainer } from '@decorators/di';

import { ContainerManager, ModuleResolver, ROOT_MODULE } from './helpers';
import { DEFAULT_PROVIDERS } from './providers';
import { ClassConstructor } from './types';

export class Application {
  static async create(rootModule: ClassConstructor) {
    const containerManger = new ContainerManager();
    const container = containerManger.create(Application);

    container.setParent(RootContainer);

    container.provide([
      {
        provide: ContainerManager,
        useValue: containerManger,
      },
      ...DEFAULT_PROVIDERS,
      {
        provide: ROOT_MODULE,
        useValue: rootModule,
      },
    ]);

    const moduleResolver = await container.get<ModuleResolver>(ModuleResolver);
    const application = new Application(containerManger);

    moduleResolver.prepareModule(rootModule, container);

    await moduleResolver.resolveModule(rootModule);

    return application;
  }

  constructor(private containerManager: ContainerManager) { }

  inject<T>(target: InjectionToken | ClassConstructor): Promise<T> {
    return this.containerManager.scan<T>(target);
  }

  scan<T>(target: InjectionToken | ClassConstructor): Promise<T[]> {
    return this.containerManager.scan<T[]>(target, true);
  }
}
