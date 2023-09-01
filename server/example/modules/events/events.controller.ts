import { Controller, Pipe } from '@server';
import { Connection, Disconnect, Event, Param, Socket } from '@server/sockets';
import { Socket as IOSocket } from 'socket.io';

import { AccessPipe } from '../../pipes';
import { Message, MessagesService } from '../../services';

@Controller()
@Pipe(AccessPipe)
export class EventsController {
  constructor(private messagesService: MessagesService) { }

  @Connection()
  connection() { }

  @Disconnect()
  disconnect() { }

  @Event('message')
  event(
    @Param() message: Message,
    @Socket() socket: IOSocket,
  ) {
    this.messagesService.addMessage(message);

    socket.broadcast.emit('message', message);

    return message;
  }
}
