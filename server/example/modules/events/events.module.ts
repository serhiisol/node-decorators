import { Module } from '@server';

import { EventsController } from './events.controller';

@Module({
  controllers: [EventsController],
  namespace: 'events',
})
export class EventsModule { }
