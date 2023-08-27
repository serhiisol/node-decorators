import { Server } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';

import { AdapterEvent, ParameterType, SocketsApplicationAdapter } from '../sockets';
import { EventType } from '../sockets/helpers';

export class SocketIoAdapter implements SocketsApplicationAdapter {
  type = 'socket-io';
  private server: Server;

  constructor(public app = new SocketIoServer()) { }

  attachServer(server: Server) {
    this.server = server;
  }

  close() {
    this.app.close();

    if (this.server.listening) {
      this.server.close();
    }
  }

  emit(socket: Socket, event: string, message: unknown) {
    socket.emit(event, message);
  }

  events(events: AdapterEvent[]) {
    for (const event of events) {
      const ns = this.app.of(event.url);

      if (event.type === EventType.CONNECTION) {
        ns.on(EventType.CONNECTION, socket => event.handler(socket, EventType.CONNECTION));
      }

      if ([EventType.DISCONNECT, EventType.DISCONNECTING].includes(event.type as EventType)) {
        ns.on(EventType.CONNECTION, socket => {
          socket.on(event.type, (...args) => event.handler(socket, event.type, ...args));
        });
      }

      if (event.type === EventType.EVENT) {
        ns.on(EventType.CONNECTION, socket => {
          socket.on(event.event, (...args) => event.handler(socket, event.event, ...args));
        });
      }
    }
  }

  getParam(type: ParameterType, index: number, socket: Socket, event: string, ...args: any[]) {
    switch (type) {
      case ParameterType.ACK: return () => this.getAck(args);
      case ParameterType.EVENT: return () => event;
      case ParameterType.PARAM: return () => args[index];
      case ParameterType.SERVER: return () => this.app;
      case ParameterType.SOCKET: return () => socket;
      default: return () => this.app;
    }
  }

  listen(options?: object) {
    this.app.listen(this.server, options);
  }

  use(...args: any[]) {
    this.app.use.call(this.app, ...args);
  }

  private getAck(args: any[]) {
    const ack = args[args.length - 1];

    return typeof ack === 'function' ? ack : undefined;
  }
}
