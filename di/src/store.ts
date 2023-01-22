import { StoreProvider, Type, Injectable, InjectableId, Dependency } from './types';
import { Reflector } from './reflector';
import { InjectionToken } from './injection-token';

export class Store {
  static providers: StoreProvider[] = [];

  /**
   * Get provider id
   */
  static providerId(injectable: Injectable): InjectableId {
    if (!injectable) {
      return null;
    }

    if (typeof injectable === 'string' || injectable instanceof InjectionToken) {
      return injectable;
    }

    return Reflector.getId(injectable);
  }

  /**
   * Register provider
   */
  static provider(type: Type, args?: { injectable?: Injectable, optional?: boolean; index?: number; }): Type {
    let provider: StoreProvider = this.findProvider(type);

    if (provider === undefined) {
      provider = this.createProvider(type);
    }

    if (args === undefined) {
      Reflector.paramTypes(type)
        .forEach((param: Injectable, index: number) => {
          if (!provider.deps[index] || !provider.deps[index].id) {
            provider.deps[index] = { id: this.providerId(param) };
          }
        });

      return type;
    }

    const dep: Dependency = provider.deps[args.index] || { id: null };

    provider.deps[args.index] = {
      id: args.injectable ? this.providerId(args.injectable) : dep.id,
      optional: args.optional || dep.optional,
    };

    return type;
  }

  /**
   * Find stored provider
   */
  static findProvider(injectable: Injectable): StoreProvider {
    const id: InjectableId = this.providerId(injectable);

    return this.providers.find((provider: StoreProvider) => provider.id === id);
  }

  /**
   * Replace stored provider wiht new provider
   */
  static replaceProvider(injectable: Injectable, provider: StoreProvider): void {
    const storeProvider: StoreProvider = this.findProvider(injectable);
    const index: number = this.providers.indexOf(storeProvider);

    if (index !== -1) {
      this.providers[index] = provider;
    } else {
      this.providers.push(provider);
    }
  }

  /**
   * Create and store provider
   */
  private static createProvider(type: Type): StoreProvider {
    const id: InjectableId = Reflector.setId(type);
    const storeProvider: StoreProvider = { id, type, deps: [] };

    this.providers.push(storeProvider);

    return storeProvider;
  }

}
