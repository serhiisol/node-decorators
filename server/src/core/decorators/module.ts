import { Injectable, Provider } from '@decorators/di';

import { MODULE_METADATA } from '../helpers';
import { ClassConstructor } from '../types';

export interface ModuleWithProviders {
  module: ClassConstructor;
  providers: (ClassConstructor | Provider)[];
}

interface ModuleOptions {
  controllers?: ClassConstructor[];
  modules?: (ModuleWithProviders | ClassConstructor)[];
  namespace?: string;
  providers?: (ClassConstructor | Provider)[];
}

/**
 * Module provides a scope providers, nested namespace
 *
 * Module options:
 * * controllers - list of controllers to handle namespace-based endpoints.
 * Each enpoint consists of parent module.namespace + controller.url + method.url
 * * modules - list of child modules
 * * namespace - prefix to be added to all nested modules and provided controllers
 * * providers - list of required providers
 */
export function Module(options: ModuleOptions) {
  return (target: ClassConstructor) => {
    const providers = (options.providers ?? []).map(injectable => (injectable as Provider).provide ? injectable : ({
      provide: injectable,
      useClass: injectable,
    }));
    const modules = (options.modules ?? []).map(module => {
      if ((module as ModuleWithProviders).module) {
        providers.push(...(module as ModuleWithProviders).providers);

        return (module as ModuleWithProviders).module;
      }

      return module;
    });

    Reflect.defineMetadata(MODULE_METADATA, {
      controllers: options.controllers ?? [],
      modules,
      providers,
      namespace: options.namespace ?? '',
    }, target);

    Injectable()(target);
  };
}
