import { Injectable, Dependency } from '../types';
import { injectableToString, markDependencies } from '../helpers';

export class InvalidDependencyError extends Error {
  constructor(injectable: Injectable, deps: Dependency[], index: number) {
    const args = markDependencies(deps, index).join(', ');

    super(`${injectableToString(injectable)}(${args})`);
  }
}
