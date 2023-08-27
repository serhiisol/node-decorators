import { ApiError, Injectable, PipeHandle, ProcessPipe, Reflector } from '@server';
import { SocketsContext } from '@server/sockets';

@Injectable()
export class DecoratorPipe implements ProcessPipe {
  constructor(private reflector: Reflector) { }

  run(context: SocketsContext, handle: PipeHandle<string>) {
    const decorated = this.reflector.getMetadata('decorated', context.getHandler());
    const socket = context.getSocket();

    if (decorated === socket['handshake']['query']['param']) {
      return handle();
    }

    throw new ApiError('decorated-error');
  }
}
