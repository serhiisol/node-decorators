import { listen } from 'socket.io';
import {
  Middleware,
  GlobalMiddleware,
  ServerMiddleware,
  Event,
  Args,
  bootstrapSocketIO,
  Namespace,
  Socket
} from '@decorators/socket';

const server = listen(3000);

class SocketWrapper {
  constructor(private socket: SocketIO.Socket) {}

  log() {
    console.log(this);
  }
}

@ServerMiddleware((io, socket, next) => {
  console.log('Global Server Middleware');
  next();
})
@GlobalMiddleware((io, socket, packet, next) => {
  console.log('Global socket middleware');
  next();
})
@Middleware((io, socket, packet, next) => {
  console.log('Controller based middleware');
  next();
})
@Namespace('/messaging')
class FirstController {

  @Event('message', (io, socket, packet, next) => {
    console.log('Message middleware');
    next();
  })
  onMessage(@Args() message, @Socket(SocketWrapper) socket: SocketWrapper) {
    socket.log();
    console.log(`Message:  ${message}`);
  }

}

@Namespace('/messaging')
class SecondController {

  @Event('message2')
  onMessage2(@Args() message) {
    console.log(`Message2:  ${message}`);
  }

}

bootstrapSocketIO(server, [FirstController, SecondController]);
