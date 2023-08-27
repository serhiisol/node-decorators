import { Inject } from '@decorators/di';

import { APP_SERVER, ClassConstructor, Module, ModuleWithProviders, Server } from '../../core';
import { EventHandler, EventResolver, MetadataScanner, SOCKETS_ADAPTER, SocketsApplicationAdapter } from './helpers';

@Module({
  providers: [
    MetadataScanner,
    EventHandler,
    EventResolver,
  ],
})
export class SocketsModule {
  static create(
    adapter: ClassConstructor<SocketsApplicationAdapter> | InstanceType<ClassConstructor<SocketsApplicationAdapter>>,
  ) {
    return {
      module: SocketsModule,
      providers: [{
        provide: SOCKETS_ADAPTER,
        ...(adapter instanceof SocketsApplicationAdapter ? { useValue: adapter } : { useClass: adapter }),
      }],
    } as ModuleWithProviders;
  }

  constructor(
    @Inject(APP_SERVER) private server: Server,
    @Inject(SOCKETS_ADAPTER) private adapter: SocketsApplicationAdapter,
    private eventResolver: EventResolver,
  ) {
    this.adapter.attachServer(this.server);
  }

  close() {
    return this.adapter.close();
  }

  getHttpServer() {
    return this.server;
  }

  async listen(port?: number, options?: object) {
    await this.eventResolver.resolve();

    await this.adapter.listen(options);

    if (this.server.listening) {
      return;
    }

    return this.server.listen(port);
  }

  set(setting: string, value: unknown) {
    this.adapter.set?.(setting, value);
  }

  use(...args: unknown[]) {
    this.adapter.use(...args);
  }
}
