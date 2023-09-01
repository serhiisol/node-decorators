import { Module } from '@server';

import { MessagesController } from './messages.controller';

@Module({
  controllers: [MessagesController],
  namespace: 'messages',
})
export class MessagesModule { }
