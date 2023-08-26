import { Injectable, PipeHandle, ProcessPipe } from '@server';
import { SocketsContext } from '@server/sockets';

import { Sequence } from '../sequence';

@Injectable()
export class MethodPipe implements ProcessPipe {
  constructor(private sequence: Sequence) { }

  async run(_context: SocketsContext, handle: PipeHandle<string>) {
    this.sequence.push('method');

    const res = await handle();

    this.sequence.push('method');

    return res;
  }
}
