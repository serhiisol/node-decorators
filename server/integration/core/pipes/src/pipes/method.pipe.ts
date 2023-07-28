import { Injectable, PipeHandle, ProcessPipe } from '@server';
import { HttpContext } from '@server/http';

import { Sequence } from '../sequence';

@Injectable()
export class MethodPipe implements ProcessPipe {
  constructor(private sequence: Sequence) { }

  async run(_context: HttpContext, handle: PipeHandle<string>) {
    this.sequence.push('method');

    const res = await handle();

    this.sequence.push('method');

    return res;
  }
}
