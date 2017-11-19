import { StoreProvider } from '../types';
import { DiError } from './error';

export class RecursiveProviderError extends DiError {

  constructor(requesters: StoreProvider[], depProvider: StoreProvider) {
    const circular: string = requesters
      .map((requester: StoreProvider) => requester.id.toString())
      .join(' => ');

    super(`
      DI recursive dependency: ${circular} => ${depProvider.id.toString()}.
    `);
  }

}
