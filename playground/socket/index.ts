import { listen } from 'socket.io';
import {
  Connect,
  attachControllers,
  Controller,
  Socket,
  Args
} from '@decorators/socket';

const server = listen(3000);

@Controller('/')
class ConnectionController {

  @Connect()
  public connect(@Socket() socket: SocketIO.Socket) {
    console.log('Socket.id=', socket.id);
  }

}

attachControllers(server, [ ConnectionController ]);
