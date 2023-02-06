import 'reflect-metadata';
import { Container } from './container';

export const RootContainer = new Container();
export { Container } from './container';
export { Injectable, Inject, Optional } from './decorators';
export { InjectionToken } from './injection-token';
export {
  Provider,
  ClassProvider,
  FactoryProvider,
  ValueProvider,
  ExistingProvider,
} from './types';
