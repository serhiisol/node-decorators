import {
  Provider,
  ContainerProvider,
  ClassProvider,
  FactoryProvider,
  ValueProvider,
  Dependency,
  Injectable,
  ExistingProvider,
} from './types';
import { InvalidDependencyError, MissingDependencyError, MissingProviderError, RecursiveDependencyError } from './errors';
import { DEP_IDS_METADATA, OPTIONAL_DEPS_METADATA } from './constants';
import { injectableToString } from './helpers';
import { InjectionToken } from './injection-token';

export class Container {
  parentContainer?: Container;
  providers = new Map<Injectable, ContainerProvider>();

  setParent(container: Container) {
    this.parentContainer = container;
  }

  /**
   * Registers new or replaces providers
   */
  provide(providers: Provider[]) {
    this.registerSingleProviders(
      providers.filter(provider => !provider.multi),
    );

    this.registerMultiProviders(
      providers.filter(provider => provider.multi),
    );
  }

  /**
   * Gets or instantiates an injectable
   */
  async get<T>(injectable: Injectable): Promise<T> {
    return this.resolve(injectable);
  }

  /**
   * Verifies that injectable is provided within the scope
   */
  has(injectable: Injectable): boolean {
    return this.providers.has(injectable) || this.parentContainer?.has(injectable);
  }

  /**
   * Resolves the provider, following deps are resolved recursively
   */
  private async resolve(
    injectable: Injectable,
    optional = false,
    sequenceDeps: Dependency[] = [],
  ) {
    let provider = this.providers.get(injectable);

    if (!provider && this.parentContainer?.has(injectable)) {
      return this.parentContainer.get(injectable);
    }

    if (!provider && !optional) {
      throw new MissingProviderError(injectable);
    }

    provider = provider ?? {};

    if (provider.value) {
      return provider.value;
    }

    const resolvedDeps = [] as unknown[];

    for (const [index, dep] of provider.deps.entries()) {
      if (!dep.id) {
        throw new InvalidDependencyError(provider.type ?? injectable, provider.deps, index);
      }

      if (sequenceDeps.find(seqDep => seqDep === dep)) {
        throw new RecursiveDependencyError(provider.type ?? injectable, provider.deps, index);
      }

      const depProvider = this.providers.get(dep.id);

      if (depProvider) {
        resolvedDeps.push(await this.resolve(dep.id, dep.optional, [...sequenceDeps, ...provider.deps]));

        continue;
      }

      if (this.parentContainer?.has(dep.id)) {
        resolvedDeps.push(await this.parentContainer.get(dep.id));

        continue;
      }

      if (!dep.optional) {
        throw new MissingDependencyError(provider.type ?? injectable, provider.deps, index);
      }

      resolvedDeps.push(undefined);
    }

    let value: unknown;

    if (provider.factory) {
      value = await provider.factory(...resolvedDeps);
    }

    if (provider.type) {
      value = new provider.type(...resolvedDeps);
    }

    this.providers.set(injectable, { ...provider, value });

    return value;
  }

  private registerMultiProviders(providers: Provider[]) {
    providers.forEach(provider => {
      const injectableId = new InjectionToken(injectableToString(provider.provide));

      // creates dependency provider for the main provider
      this.registerSingleProviders([{ ...provider, provide: injectableId }]);

      const containerProvider = this.providers.get(provider.provide);

      if (containerProvider) {
        return containerProvider.deps.push({ id: injectableId });
      }

      // creates main provider that will hold all other providers as deps
      this.registerSingleProviders([{
        provide: provider.provide,
        useFactory: (...deps) => deps,
        deps: [injectableId],
      }]);
    });
  }

  private registerSingleProviders(providers: Provider[]) {
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

      if ((provider as ExistingProvider).useExisting) {
        return this.registerExistingProvider(provider as ExistingProvider);
      }
    });
  }

  private registerClassProvider(provider: ClassProvider) {
    const ids = Reflect.getMetadata(DEP_IDS_METADATA, provider.useClass) ?? [];
    const optionals = Reflect.getMetadata(OPTIONAL_DEPS_METADATA, provider.useClass) ?? [];

    this.providers.set(provider.provide, {
      type: provider.useClass,
      deps: ids.map((id: Injectable, index: number) =>
        ({ id, optional: optionals[index] }),
      ),
    });
  }

  private registerFactoryProvider(provider: FactoryProvider) {
    this.providers.set(provider.provide, {
      deps: provider.deps?.map(id => ({ id })) ?? [],
      factory: provider.useFactory,
    });
  }

  private registerValueProvider(provider: ValueProvider) {
    this.providers.set(provider.provide, {
      value: provider.useValue,
    });
  }

  private registerExistingProvider(provider: ExistingProvider) {
    this.registerFactoryProvider({
      provide: provider.provide,
      deps: [provider.useExisting],
      useFactory: (existing: unknown) => existing,
    });
  }
}
