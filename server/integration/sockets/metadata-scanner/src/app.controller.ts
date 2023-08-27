import { Controller } from '@server';
import { Event, Param } from '@server/sockets';

@Controller()
export class AppController {
  @Event('message')
  message(@Param() message: string) {
    return message;
  }
}
