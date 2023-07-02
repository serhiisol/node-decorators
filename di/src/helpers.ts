import { Injectable, ClassConstructor, Dependency } from './types';

export function injectableToString(injectable: Injectable): string {
  return (injectable as ClassConstructor).name || injectable.toString();
}

export function markDependencies(deps: Dependency[], index: number): string[] {
  return deps.map((dep, i) => {
    const name = injectableToString(dep.id);

    return i === index ? `?${name}` : name ;
  });
}
