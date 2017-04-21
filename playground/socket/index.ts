import { listen } from 'socket.io';
import {
  Middleware,
  ServerMiddleware,
  Event,
  Args,
  attachControllers,
  Controller,
  Socket
} from '@decorators/socket';

const server = listen(3000);

class SocketWrapper {
  constructor(private socket: SocketIO.Socket) {}
  log(message: string) {
    console.log('Log::', message);
  }
}

@ServerMiddleware((io, socket, next) => {
  console.log('Global Server Middleware');
  next();
})
@Middleware((io, socket, packet, next) => {
  console.log('Global Socket Middleware');
  next();
})
@Controller('/messaging', (io, socket, packet, next) => {
  console.log('Controller Middleware');
  next();
})
class FirstController {

  deps: any[];

  constructor(...args) {
    console.log('Controller Instantiation', args);
    this.deps = args;
  }

  @Event('message', (io, socket, packet, next) => {
    console.log('Event Middleware');
    next();
  })
  onMessage(@Args() message, @Socket(SocketWrapper) socket: SocketWrapper) {
    socket.log(`Message:  ${message} ${this.deps.toString()}`);
  }

}

attachControllers(server, [
  { provide: FirstController, deps: [1, 2, 3] }
]);
