import { listen } from 'socket.io';
import {
  Middleware,
  GlobalMiddleware,
  ServerMiddleware,
  Event,
  Args,
  bootstrapSocketIO,
  Namespace
} from '@decorators/socket';

const server = listen(3000);

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
  onMessage(@Args() message) {
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
