import { ClassConstructor, Context, Handler } from '../../../core';
import { SocketsApplicationAdapter } from './sockets-application-adapter';

export class SocketsContext extends Context {
  constructor(
    protected controller: ClassConstructor,
    protected handler: Handler,
    protected adapter: SocketsApplicationAdapter,
    protected server: unknown,
    protected socket: unknown,
    protected args: unknown[],
  ) {
    super(controller, handler);
  }

  emit(event: string, message: unknown) {
    return this.adapter.emit(this.socket, event, message);
  }

  getArgs<T = unknown[]>() {
    return this.args as T;
  }

  getServer<Server>() {
    return this.server as Server;
  }

  getSocket<Socket>() {
    return this.socket as Socket;
  }
}
