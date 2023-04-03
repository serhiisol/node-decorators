import { Inject, Injectable } from '@decorators/di';

import { ClassConstructor, Module, ModuleWithProviders, ROOT_MODULE } from '../../core';
import { HTTP_ADAPTER, HttpApplicationAdapter, MetadataScanner, RouteHandler, RouteResolver } from './helpers';

@Injectable()
@Module({
  providers: [
    MetadataScanner,
    RouteHandler,
    RouteResolver,
  ],
})
export class HttpModule {
  static create(adapter: ClassConstructor<HttpApplicationAdapter>) {
    return {
      module: HttpModule,
      providers: [{
        provide: HTTP_ADAPTER,
        useClass: adapter,
      }],
    } as ModuleWithProviders;
  }

  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
    @Inject(ROOT_MODULE) private rootModule: ClassConstructor,
    private routeResolver: RouteResolver,
  ) { }

  async listen(port: number) {
    await this.routeResolver.resolve(this.rootModule);

    return this.adapter.listen(port);
  }

  set(setting: string, value: unknown) {
    this.adapter.set(setting, value);
  }

  use(...args: unknown[]) {
    this.adapter.use(...args);
  }
}
