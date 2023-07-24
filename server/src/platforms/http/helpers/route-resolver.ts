import { Inject, Injectable, Optional } from '@decorators/di';

import { asyncMap, ClassConstructor, ContainerManager, GLOBAL_PIPE, ProcessPipe } from '../../../core';
import { HTTP_ADAPTER } from './constants';
import { HttpApplicationAdapter } from './http-application-adapter';
import { MetadataScanner } from './metadata-scanner';
import { RouteHandler } from './route-handler';

@Injectable()
export class RouteResolver {
  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
    @Inject(GLOBAL_PIPE) @Optional() private globalPipes: ProcessPipe[],
    private containerManager: ContainerManager,
    private metadataScanner: MetadataScanner,
    private routeHandler: RouteHandler,
  ) { }

  async resolve() {
    const metadatas = this.metadataScanner.scan();

    for (const metadata of metadatas) {
      const container = this.containerManager.get(metadata.module);
      const controller = await container.get<InstanceType<ClassConstructor>>(metadata.controller);
      const routePipes = await asyncMap(metadata.pipes, (pipe: ClassConstructor) =>
        container.get<ProcessPipe>(pipe),
      );

      const handler = this.routeHandler.createHandler(
        controller,
        metadata.methodName,
        metadata.params,
        [...(this.globalPipes ?? []), ...routePipes],
        metadata.status,
        metadata.template,
      );

      this.adapter.route(metadata.url, metadata.type, handler);
    }
  }
}
