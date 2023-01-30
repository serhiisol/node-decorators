import {
  InjectableId,
  Provider,
  StoreProvider,
  ClassProvider,
  FactoryProvider,
  ValueProvider,
  Dependency,
  Injectable,
  Factory,
} from './types';
import { Store } from './store';
import { MissingProviderError, RecursiveProviderError } from './errors';

export class Container {

  /**
   * Register new or replace providers
   */
  static provide(providers: Provider[]) {
    providers.forEach(provider => {
      if ((provider as ClassProvider).useClass) {
        return this.registerClassProvider(provider as ClassProvider);
      }

      if ((provider as FactoryProvider).useFactory) {
        return this.registerFactoryProvider(provider as FactoryProvider);
      }

      if ((provider as ValueProvider).useValue) {
        return this.registerValueProvider(provider as ValueProvider);
      }
    });
  }

  /**
   * Get instance of injectable
   */
  static get<T>(injectable: Injectable): Promise<T> {
    const provider: StoreProvider = Store.findProvider(injectable);

    if (!provider) {
      throw new MissingProviderError(injectable);
    }

    return this.resolveProvider<T>(provider);
  }

  /**
   * Resolve provider
   */
  private static async resolveProvider<T>(provider: StoreProvider, requesters: StoreProvider[] = []): Promise<T> {
    if (provider.value) {
      return provider.value;
    }

    const _requesters = requesters.concat([provider]);

    const deps = provider.deps.map((dep: Dependency) => {
      const requesterProvider: StoreProvider =
        _requesters.find((requester: StoreProvider) => requester.id === dep.id);

      if (requesterProvider) {
        throw new RecursiveProviderError(_requesters, requesterProvider);
      }

      const depService: StoreProvider = Store.findProvider(dep.id);

      if (!depService && !dep.optional) {
        throw new MissingProviderError(provider, dep);
      }

      if (!depService && dep.optional) {
        return null;
      }

      return this.resolveProvider(depService, _requesters);
    });

    const resolvedDeps = await Promise.all(deps);

    return provider.factory ? provider.factory(...resolvedDeps) : new provider.type(...resolvedDeps);
  }

  /**
   * Register class provider
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
   */
  private static registerFactoryProvider(provider: FactoryProvider): void {
    const id: InjectableId = Store.providerId(provider.provide);
    const factory: Factory = provider.useFactory;
    const deps: Dependency[] = (provider.deps || [])
      .map((dep: Injectable) => ({ id: Store.providerId(dep) }));

    Store.replaceProvider(provider.provide, { id, factory, deps });
  }

  /**
   * Register value provider
   */
  private static registerValueProvider(provider: ValueProvider): void {
    const id: InjectableId = Store.providerId(provider.provide);
    const value: any = provider.useValue;

    Store.replaceProvider(provider.provide, { id, value });
  }
}
