import { Inject } from '@decorators/di';

import { ClassConstructor, Module, ModuleWithProviders } from '../../core';
import { HTTP_ADAPTER, HttpApplicationAdapter, MetadataScanner, RouteHandler, RouteResolver } from './helpers';

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
    private routeResolver: RouteResolver,
  ) { }

  close() {
    this.adapter.close();
  }

  getHttpServer() {
    return this.adapter.server;
  }

  async listen(port?: number) {
    await this.routeResolver.resolve();

    return this.adapter.listen(port);
  }

  set(setting: string, value: unknown) {
    this.adapter.set?.(setting, value);
  }

  use(...args: unknown[]) {
    this.adapter.use(...args);
  }
}
