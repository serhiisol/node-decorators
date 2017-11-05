import { listen } from 'socket.io';
import {
  Connect,
  attachControllers,
  Controller,
  Socket,
  Args,
  Middleware,
  Event
} from '@decorators/socket';

const server = listen(3000);

@Middleware((io, socket, next) => {
  console.log('Middleware 1');
  next();
})
@Controller('/', (io, socket, args, next) => {
  console.log('ControllerMiddleware');
  next();
})
class ConnectionController {

  // @Connect()
  // public connect(@Socket() socket: SocketIO.Socket) {
  //   console.log('Socket.id=', socket.id);
  // }

  // @Event('message')
  // public message(@Args() message: string) {
  //   console.log('Message', message);
  // }

}

@Middleware((io, socket, next) => {
  console.log('Middleware 2');
  next(new Error('Test Error'));
})
@Controller('/')
class MessagingController {

  @Connect()
  public connect(@Socket() socket: SocketIO.Socket) {
    console.log('connect');
  }

  @Event('message')
  public message(@Args() message: string) {
    console.log('Message', message);
  }

}

attachControllers(server, [ ConnectionController, MessagingController ]);
