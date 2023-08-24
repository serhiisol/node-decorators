import { Inject, Injectable } from '@decorators/di';

import { asyncMap, ClassConstructor, ContainerManager, ProcessPipe } from '../../../core';
import { RouteMetadata } from '../types';
import { HTTP_ADAPTER } from './constants';
import { HttpApplicationAdapter } from './http-application-adapter';
import { MetadataScanner } from './metadata-scanner';
import { RouteHandler } from './route-handler';

@Injectable()
export class RouteResolver {
  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
    private containerManager: ContainerManager,
    private metadataScanner: MetadataScanner,
    private routeHandler: RouteHandler,
  ) { }

  async resolve() {
    const metadatas = this.metadataScanner.scan();

    const baseRoutes = metadatas.filter(meta => !meta.url.includes('*'));
    const wildcardRoutes = metadatas
      .filter(meta => meta.url.includes('*'))
      .sort(this.sortWildcardRoutes);

    const routes = [];

    for (const metadata of [...baseRoutes, ...wildcardRoutes]) {
      const container = this.containerManager.get(metadata.module);
      const controller = await container.get<InstanceType<ClassConstructor>>(metadata.controller);
      const routePipes = await asyncMap(metadata.pipes, (pipe: ClassConstructor) =>
        container.get<ProcessPipe>(pipe),
      );

      const handler = this.routeHandler.createHandler(
        controller,
        metadata.methodName,
        metadata.params,
        routePipes,
        metadata.status,
        metadata.template,
      );

      routes.push({
        handler,
        type: metadata.type,
        url: metadata.url,
      });
    }

    this.adapter.routes(routes);
  }

  sortWildcardRoutes(routeA: RouteMetadata, routeB: RouteMetadata) {
    const segmentsA = routeA.url.split('/').length;
    const segmentsB = routeB.url.split('/').length;

    if (segmentsA === segmentsB) {
      return routeB.url.length - routeA.url.length;
    }

    return segmentsB - segmentsA;
  }
}
