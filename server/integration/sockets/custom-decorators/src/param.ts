import { createParamDecorator } from '@server';
import { SocketsContext } from '@server/sockets';

export function Param() {
  return createParamDecorator((context: SocketsContext) => {
    const socket = context.getSocket();

    return socket['handshake']?.['query']?.['param'];
  });
}
