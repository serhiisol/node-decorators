import { Inject, Injectable } from '@decorators/di';

import { asyncMap, ClassConstructor, ContainerManager, isEnum, MetadataScanner, ProcessPipe } from '../../../core';
import { EventMetadata } from '../types';
import { EventType, SOCKETS_ADAPTER } from './constants';
import { EventHandler } from './event-handler';
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
    const metadatas = this.metadataScanner.scan<EventMetadata>()
      .filter(meta => isEnum(EventType, meta.type));

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
        metadata.type as EventType,
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
