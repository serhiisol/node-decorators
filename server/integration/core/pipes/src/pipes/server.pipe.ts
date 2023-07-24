import { ApiError, HttpContext, Injectable, PipeHandle, ProcessPipe } from '@server';

import { Sequence } from '../sequence';

@Injectable()
export class ServerPipe implements ProcessPipe {
  constructor(private sequence: Sequence) { }

  async run(_context: HttpContext, handle: PipeHandle<string>) {
    let res: unknown;
    let err: ApiError;

    this.sequence.push('server');

    try {
      res = await handle();
    } catch (e) {
      err = e;
    }

    this.sequence.push('server');

    return err ?? res;
  }
}
