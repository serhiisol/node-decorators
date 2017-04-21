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

function makeMiddleware(message, status?) {
  return (...args) => {
    const next = args.pop();
    console.log('MIDDLEWARE', message);
    next(status ? new Error(message) : null);
  };
}

const server = listen(3000);

class SocketWrapper {
  constructor(private socket: SocketIO.Socket) {}
  log(message: string) {
    console.log('Log::', message);
  }
}

@ServerMiddleware([makeMiddleware('GLOBAL_SERVER 1-1'), makeMiddleware('GLOBAL_SERVER 1-2')])
@Middleware([makeMiddleware('GLOBAL_SOCKET 1-1'), makeMiddleware('GLOBAL_SOCKET 1-2')])
@Controller('/messaging', [makeMiddleware('CONTROLLER 1-1', true), makeMiddleware('CONTROLLER 1-2')])
class MessagingController {

  deps: any[];

  constructor(...args) {
    console.log('1. Controller Instantiation', args);
    this.deps = args;
  }

  @Event('message', [makeMiddleware('EVENT 1-1'), makeMiddleware('EVENT 1-2')])
  onMessage(@Args() message, @Socket(SocketWrapper) socket: SocketWrapper) {
    socket.log(`1. Message:  ${message} ${this.deps.toString()}`);
  }

}

@ServerMiddleware([makeMiddleware('GLOBAL_SERVER 2-1'), makeMiddleware('GLOBAL_SERVER 2-2')])
@Middleware([makeMiddleware('GLOBAL_SOCKET 2-1'), makeMiddleware('GLOBAL_SOCKET 2-2')])
@Controller('/messaging', [makeMiddleware('CONTROLLER 2-1'), makeMiddleware('CONTROLLER 2-2')])
class PushController {

  deps: any[];

  constructor(...args) {
    console.log('2. Controller Instantiation', args);
    this.deps = args;
  }

  @Event('push', [makeMiddleware('EVENT 2-3'), makeMiddleware('EVENT 2-4')])
  onPush(@Args() message, @Socket(SocketWrapper) socket: SocketWrapper) {
    socket.log(`2. push:  ${message} ${this.deps.toString()}`);
  }

}

attachControllers(server, [
  { provide: MessagingController, deps: [1, 2, 3] },
  { provide: PushController, deps: [] }
]);
