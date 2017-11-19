import { StoreProvider, Dependency, Injectable } from '../types';
import { DiError, id } from './error';

export class MissingProviderError extends DiError {

  constructor(provider: StoreProvider | Injectable, dep?: Dependency) {
    const message = dep ?
      `
        In order to get DI working, you have to provide Injectable.
        DI attempt for ${id(provider)} and dependency ${id(dep)}.
      ` :
      `
        In order to get DI working, you have to provide Injectable.
        DI attempt for ${id(provider)}.
      `;

    super(message);
  }

}
