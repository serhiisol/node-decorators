import { StoreProvider, Dependency } from '../types';
import { DiError } from './error';

export class MissingProviderError extends DiError {

  constructor(provider: StoreProvider, dep: Dependency) {
    super(`
      In order to get DI working, you have to provide Injectable.
      DI attempt for ${provider.id.toString()} and dependency ${dep.id.toString()}
    `);
  }

}
