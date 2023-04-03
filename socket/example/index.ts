/* eslint-disable max-classes-per-file */

import { listen, Server, Namespace, Socket } from 'socket.io';
import { Container, Injectable } from '@decorators/di';
import { Event, Args, attachControllers, Controller, IO_MIDDLEWARE, ServerMiddleware } from '../src';

const server = listen(3000);

class GlobalMiddleware implements ServerMiddleware {
  use(_io: Server | Namespace, _socket: Socket, next: (error?: Error) => void) {
    console.log('GlobalMiddleware');

    next();
  }
}

@Injectable()
@Controller('')
class MessageController {
  @Event('message')
  onMessage(@Args() message) {
    console.log(
      `Message:  ${message}`
    );
  }
}

Container.provide([{
  provide: IO_MIDDLEWARE, useClass: GlobalMiddleware,
}]);

attachControllers(server, [ MessageController ]);
