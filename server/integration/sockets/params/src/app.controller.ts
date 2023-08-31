import { Controller } from '@server';
import { Connection, Disconnect, Event, Param, Server, Socket } from '@server/sockets';

import { Sequence } from './sequence';

@Controller()
export class AppController {
  constructor(private sequence: Sequence) { }

  @Connection()
  connection(
    @Server() server: object,
    @Socket() socket: object,
  ) {
    this.sequence.push(`connection: ${server.constructor.name} ${socket.constructor.name}`);
  }

  @Disconnect()
  disconnect(
    @Server() server: object,
    @Socket() socket: object,
  ) {
    this.sequence.push(`disconnect: ${server.constructor.name} ${socket.constructor.name}`);
  }

  @Event('message')
  message(
    @Server() server: object,
    @Socket() socket: object,
    @Param() message: string,
    @Param() message2: string,
  ) {
    this.sequence.push(`event: ${server.constructor.name} ${socket.constructor.name} ${message} ${message2}`);

    return `${message} ${message2}`;
  }
}
