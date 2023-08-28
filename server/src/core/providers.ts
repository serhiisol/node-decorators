import { Provider } from '@decorators/di';

import { MetadataScanner, ModuleResolver, ParamValidator, Pipeline, Reflector } from './helpers';

export const DEFAULT_PROVIDERS = [
  {
    provide: Reflector,
    useClass: Reflector,
  },
  {
    provide: MetadataScanner,
    useClass: MetadataScanner,
  },
  {
    provide: ModuleResolver,
    useClass: ModuleResolver,
  },
  {
    provide: Pipeline,
    useClass: Pipeline,
  },
  {
    provide: ParamValidator,
    useClass: ParamValidator,
  },
] as Provider[];
