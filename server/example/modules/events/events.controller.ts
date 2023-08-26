import { Controller } from '@server';
import { Connection, Disconnect, Event, Param } from '@server/sockets';
import { IsString } from 'class-validator';

class MessageType {
  @IsString()
  message: string;
}

@Controller()
export class EventsController {
  @Connection()
  connection() { }

  @Disconnect()
  disconnect() { }

  @Event('message')
  event(@Param() message: MessageType) {
    return message;
  }
}
