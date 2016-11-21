import { listen } from 'socket.io';
import {
  Middleware,
  SocketMiddleware,
  OnConnect,
  OnSocket,
  Args,
  bootstrapSocketIO,
  Controller
} from '@decorators/socket'

const server = listen(3000);

@Middleware((socket, next) => {
  console.log('Global IO Middleware');
  next();
})
@SocketMiddleware((socket, next) => {
  console.log('Middleware for each single event');
  next();
})
@Controller('/messaging')
class FirstController {

  @OnConnect()
  onConnection() {
    console.log('User connected');
  }

  @OnSocket('message')
  onMessage(@Args() message) {
    console.log(`Message:  ${message}`);
  }

}

bootstrapSocketIO(server, [FirstController]);


/**
 * Add controllers to socket only
 */
// import {attachControllerToSocket} from '@decorators/socket'
// const server3003 = listen(3003);
//
// @SocketMiddleware((socket, next) => {
//   console.log('on each event');
//   next();
// })
// class ExternalController {
//   @OnSocket('register')
//   onregister() {
//     console.log('register');
//   }
// }
//
// server3003.on('connection', (socket) => {
//   attachControllerToSocket(server3003, socket, [ExternalController]);
// });
