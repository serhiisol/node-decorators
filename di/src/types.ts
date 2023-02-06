import { InjectionToken } from './injection-token';

export type Injectable
  = ClassConstructor
  | InjectionToken
  | string;

export type InjectableId
  = InjectionToken
  | string;

export type Provider
  = ClassProvider
  | FactoryProvider
  | ValueProvider
  | ExistingProvider;

export interface ClassProvider {
  multi?: boolean;
  provide: Injectable;
  useClass: ClassConstructor;
}

export interface FactoryProvider {
  deps?: Injectable[];
  multi?: boolean;
  provide: Injectable;
  useFactory: Factory;
}

export interface ValueProvider {
  multi?: boolean;
  provide: Injectable;
  useValue: any;
}

export interface ExistingProvider {
  multi?: boolean;
  provide: Injectable;
  useExisting: Injectable;
}

export interface Dependency {
  id: Injectable;
  optional?: boolean;
}

export interface ContainerProvider {
  deps?: Dependency[];
  factory?: Factory;
  type?: ClassConstructor;
  value?: any;
}

export type ClassConstructor = new (...args: any[]) => any;

export type Factory = (...args: any[]) => Promise<any> | any;
