import { Container, Injectable, InjectionToken } from '@decorators/di';

import { ClassConstructor } from '../types';

@Injectable()
export class ContainerManager {
  private containers = new Map<ClassConstructor, Container>();

  create(module: ClassConstructor) {
    const container = new Container();

    this.containers.set(module, container);

    return container;
  }

  get(module: ClassConstructor) {
    return this.containers.get(module);
  }

  async scan<T>(target: InjectionToken | ClassConstructor, pickAll = false): Promise<T> {
    const providers = [];

    for (const container of [...this.containers.values()]) {
      if (container.has(target)) {
        providers.push(await container.get(target));
      }
    }

    return pickAll ? providers : providers[0];
  }
}
