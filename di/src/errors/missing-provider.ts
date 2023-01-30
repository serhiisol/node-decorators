import { StoreProvider, Dependency, Injectable } from '../types';
import { DiError, id } from './error';

export class MissingProviderError extends DiError {
  constructor(provider: StoreProvider | Injectable, dep?: Dependency) {
    const message = dep ?
      `Missing dependency ${id(dep)} for ${id(provider)}` :
      `Missing provider ${id(provider)}`;

    super(message);
  }
}
