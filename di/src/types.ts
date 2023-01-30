import { InjectionToken } from './injection-token';

/**
 * Possible injectable type
 */
export type Injectable
  = Type
  | InjectionToken
  | string;

/**
 * Possible injectable id
 */
export type InjectableId
  = InjectionToken
  | string;

/**
 * DI Provider
 *
 * @example
 * [
 *   ServiceProvider,
 *   { provide: TOKEN, useFactory: () => service, deps: [] },
 *   { provide: TOKEN, useValue: "Token Value" },
 *   { provide: TOKEN, useClass: Service }
 * ]
 */
export type Provider
  = ClassProvider
  | FactoryProvider
  | ValueProvider;

/**
 * Class provider
 *
 * @example
 * [
 *   ServiceProvider
 * ]
 */
export interface ClassProvider {
  provide: Injectable;
  useClass: Type;
  deps?: Injectable[];
}

/**
 * Factory provider
 *
 * @example
 * [
 *   { provide: TOKEN, useFactory: () => service, deps: [] }
 * ]
 */
export interface FactoryProvider {
  provide: Injectable;
  useFactory: Factory;
  deps?: Injectable[];
}

/**
 * Value provider
 *
 * @example
 * [
 *   { provide: TOKEN, useValue: "Token Value" }
 * ]
 */
export interface ValueProvider {
  provide: Injectable;
  useValue: any;
}

/**
 * Registered provider in the store
 */
export interface StoreProvider {
  id: InjectableId;
  deps?: Dependency[];
  type?: Type;
  factory?: Factory;
  value?: any;
}

/**
 * Injectable dependency
 */
export interface Dependency {
  id: InjectableId;
  optional?: boolean;
}

/**
 * Generic interface for the service / class
 */
export type Type = new (...args: any[]) => any;

/**
 * Generic factory function type
 */
export type Factory = (...args: any[]) => Promise<any> | any;
