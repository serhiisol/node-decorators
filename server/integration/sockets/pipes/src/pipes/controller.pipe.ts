import { ApiError, Injectable, PipeHandle, ProcessPipe } from '@server';
import { SocketsContext } from '@server/sockets';

import { Sequence } from '../sequence';

@Injectable()
export class ControllerPipe implements ProcessPipe {
  constructor(private sequence: Sequence) { }

  async run(context: SocketsContext, handle: PipeHandle<string>) {
    this.sequence.push('controller');

    const [eventName] = context.getArgs();

    if (eventName === 'with-pipe-error') {
      throw new ApiError('pipe-error');
    }

    const result = await handle();

    this.sequence.push('controller');

    return result;
  }
}
