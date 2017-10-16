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

export class Container {

  /**
   * Register new or replace provider
   *
   * @static
   * @param {(Provider | Provider[])} provider
   */
  public static provide(provider: Provider | Provider[]) {
    const providers: Provider[] = Array.isArray(provider) ? provider : [provider];

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

    const deps = provider
      .deps.map((dep: Dependency) => {
        const requesterProvider: StoreProvider =
          requesters.find((requester: StoreProvider) => requester.id === dep.id);

        if (requesterProvider) {
          const circular: string = requesters
            .map((requester: StoreProvider) => requester.id.toString())
            .join('=>');

          throw new Error(`
            DI recursive dependency: ${circular} => ${dep.id.toString()} => ${requesterProvider.id.toString()}
          `);
        }

        const depService = Store.findProvider(dep.id);

        if (!depService && !dep.optional) {
          throw new Error(`
            In order to get DI working, you have to provide Injectable.
            DI attempt for ${provider.id.toString()} and dependency ${dep.id.toString()}
          `);
        }

        if (!depService && dep.optional) {
          return null;
        }

        return this.resolveProvider(depService, requesters.concat(provider));
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
    const deps: Dependency[] = classProvider.deps || provider.deps
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
