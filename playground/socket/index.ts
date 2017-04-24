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

@Controller('/')
class MessagingController {

  @Event('message')
  onMessage(
    @Args() args,
    @Socket() socket,
    @Ack() ack,
    @IO() io,
  ) {
    console.log(
      io.constructor.name,
      socket.constructor.name,
      args,
      ack
    );
  }

}

class TestClass {
  constructor() {
    console.log('Test Class');
  }
}

attachControllers(server, [ MessagingController, TestClass ]);
