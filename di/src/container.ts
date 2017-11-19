import {
  InjectableId,
  Provider,
  StoreProvider,
  ClassProvider,
  FactoryProvider,
  ValueProvider,
  Dependency,
  Injectable,
  Factory
} from './types';
import { Store } from './store';
import { MissingProviderError, RecursiveProviderError } from './errors';

export class Container {

  /**
   * Register new or replace providers
   *
   * @static
   * @param {Provider[]} providers
   */
  public static provide(providers: Provider[]) {
    providers
      .filter((_provider: ClassProvider) => _provider.useClass)
      .forEach((_provider: ClassProvider) => this.registerClassProvider(_provider));

    providers
      .filter((_provider: FactoryProvider) => _provider.useFactory)
      .forEach((_provider: FactoryProvider) => this.registerFactoryProvider(_provider));

    providers
      .filter((_provider: ValueProvider) => _provider.useValue)
      .forEach((_provider: ValueProvider) => this.registerValueProvider(_provider));
  }

  /**
   * Get instance of injectable
   *
   * @template T
   * @param {Injectable} injectable
   * @returns {T}
   */
  public static get<T>(injectable: Injectable): T {
    const provider: StoreProvider = Store.findProvider(injectable);

    if (provider === undefined) {
      throw new MissingProviderError(injectable);
    }

    return this.resolveProvider(provider)
  }

  /**
   * Resolve provider
   *
   * @private
   * @param {StoreProvider} provider
   * @param {StoreProvider[]} [requesters = []] provider, that initiated di
   * @returns {*}
   */
  private static resolveProvider(provider: StoreProvider, requesters: StoreProvider[] = []): any {
    if (provider.value) {
      return provider.value;
    }

    requesters.push(provider);

    const deps = provider
      .deps.map((dep: Dependency) => {
        const requesterProvider: StoreProvider =
          requesters.find((requester: StoreProvider) => requester.id === dep.id);

        if (requesterProvider) {
          throw new RecursiveProviderError(requesters, requesterProvider);
        }

        const depService: StoreProvider = Store.findProvider(dep.id);

        if (!depService && !dep.optional) {
          throw new MissingProviderError(provider, dep);
        }

        if (!depService && dep.optional) {
          return null;
        }

        return this.resolveProvider(depService, requesters);
      });

    provider.value = provider.factory ?
      provider.factory(...deps) : new provider.type(...deps);

    return provider.value;
  }

  /**
   * Register class provider
   *
   * @private
   * @static
   * @param {ClassProvider} provider
   */
  private static registerClassProvider(provider: ClassProvider): void {
    const id: InjectableId = Store.providerId(provider.provide);
    const classProvider: StoreProvider = Store.findProvider(provider.useClass);
    const deps: Dependency[] = classProvider ? classProvider.deps : (provider.deps || [])
      .map((dep: Injectable) => ({ id: Store.providerId(dep) }));

    Store.replaceProvider(provider.provide, { id, deps, type: provider.useClass });
  }

  /**
   * Register factory provider
   *
   * @private
   * @static
   * @param {FactoryProvider} provider
   */
  private static registerFactoryProvider(provider: FactoryProvider): void {
    const id: InjectableId = Store.providerId(provider.provide);
    const factory: Factory = provider.useFactory;
    const deps: Dependency[] = (provider.deps || [])
      .map((dep: Injectable) => ({ id: Store.providerId(dep) }));

    Store.replaceProvider(provider.provide, { id, factory, deps })
  }

  /**
   * Register value provider
   *
   * @private
   * @static
   * @param {ValueProvider} provider
   * @memberof Container
   */
  private static registerValueProvider(provider: ValueProvider): void {
    const id: InjectableId = Store.providerId(provider.provide);
    const value: any = provider.useValue;

    Store.replaceProvider(provider.provide, { id, value });
  }

}
