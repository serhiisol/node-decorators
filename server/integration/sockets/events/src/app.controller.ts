import { Controller } from '@server';
import { Connection, Disconnect, Event } from '@server/sockets';

import { Sequence } from './sequence';

@Controller()
export class AppController {
  constructor(private sequence: Sequence) { }

  @Connection()
  connection() {
    this.sequence.push('connection');
  }

  @Disconnect()
  disconnect() {
    this.sequence.push('disconnect');
  }

  @Event('message')
  message() {
    this.sequence.push('event');
  }
}
