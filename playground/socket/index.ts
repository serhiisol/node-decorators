import { listen } from 'socket.io';
import {
  Connect,
  attachControllers,
  Controller,
  Socket,
  Args,
  Middleware,
  Event,
  IO_MIDDLEWARE
} from '@decorators/socket';
import { Container, Injectable, Inject, InjectionToken } from '@decorators/di';

const server = listen(3000);
const MESSAGE = new InjectionToken('MESSAGE');

class ServerMiddleware implements Middleware {
  public use(io, socket, next) {
    console.log('ServerMiddleware');
    next();
  }
}

@Injectable()
class ControllerMiddleware implements Middleware {
  public use(io, socket, args, next) {
    console.log('ControllerMiddleware');
    next(new Error('Denied'));
  }
}

@Controller('/', [ControllerMiddleware])
@Injectable()
class ConnectionController {

  constructor(@Inject(MESSAGE) private welcomeMessage: string) {}

  // @Connect()
  // public connect(@Socket() socket: SocketIO.Socket) {
  //   console.log('Socket.id=', socket.id);
  // }

  @Event('message')
  public message(@Args() message: string) {
    console.log('Message', this.welcomeMessage, message);
  }

}

@Controller('/messaging')
@Injectable()
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

Container.provide([
  { provide: MESSAGE, useValue: 'Socket welcomes user' },
  { provide: IO_MIDDLEWARE, useClass: ServerMiddleware }
])

attachControllers(server, [ ConnectionController, MessagingController ]);

// server.on('connection', (socket) => {

//   (socket as any).use((packet, next) => {
//     next(new Error('Denied'));
//   });

//   socket.on('message', () => {
//     console.log('123123');
//   });

// });
