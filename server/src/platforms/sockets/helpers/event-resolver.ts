import { Inject, Injectable } from '@decorators/di';

import { asyncMap, ClassConstructor, ContainerManager, ProcessPipe } from '../../../core';
import { SOCKETS_ADAPTER } from './constants';
import { EventHandler } from './event-handler';
import { MetadataScanner } from './metadata-scanner';
import { SocketsApplicationAdapter } from './sockets-application-adapter';

@Injectable()
export class EventResolver {
  constructor(
    @Inject(SOCKETS_ADAPTER) private adapter: SocketsApplicationAdapter,
    private containerManager: ContainerManager,
    private metadataScanner: MetadataScanner,
    private eventHandler: EventHandler,
  ) { }

  async resolve() {
    const metadatas = this.metadataScanner.scan();
    const events = [];

    for (const metadata of metadatas) {
      const container = this.containerManager.get(metadata.module);
      const controller = await container.get<InstanceType<ClassConstructor>>(metadata.controller);
      const eventPipes = await asyncMap(metadata.pipes, (pipe: ClassConstructor) =>
        container.get<ProcessPipe>(pipe),
      );

      const handler = this.eventHandler.createHandler(
        controller,
        metadata.methodName,
        metadata.params,
        eventPipes,
      );

      events.push({
        event: metadata.event,
        handler,
        type: metadata.type,
        url: metadata.url,
      });
    }

    this.adapter.events(events);
  }
}
