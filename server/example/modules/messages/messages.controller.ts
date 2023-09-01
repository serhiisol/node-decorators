import { Controller, Pipe } from '@server';
import { Get } from '@server/http';

import { AccessPipe } from '../../pipes';
import { MessagesService } from '../../services';

@Controller()
@Pipe(AccessPipe)
export class MessagesController {
  constructor(private messagesService: MessagesService) { }

  @Get()
  messages() {
    return this.messagesService.getMessages();
  }
}
