import { listen } from 'socket.io';
import {
  Event,
  attachControllers,
  Controller,
  Socket,
  Args,
  IO,
  Ack
} from '@decorators/socket';

const server = listen(3000);

class Wrapper {
  constructor(data: any) {
    console.log('Wrapper');
  }
}

@Controller('/')
class MessagingController {

  @Event('message')
  onMessage(@Args() message: string) {
    console.log(
      `Message: ${message}`
    );
  }

}

attachControllers(server, [ MessagingController ]);
