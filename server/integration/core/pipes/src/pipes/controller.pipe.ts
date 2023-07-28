import { ApiError, Injectable, PipeHandle, ProcessPipe } from '@server';
import { HttpContext } from '@server/http';

import { Sequence } from '../sequence';

@Injectable()
export class ControllerPipe implements ProcessPipe {
  constructor(private sequence: Sequence) { }

  async run(context: HttpContext, handle: PipeHandle<string>) {
    const req = context.getRequest();
    let res: unknown;

    this.sequence.push('controller');

    if (req['url'] === '/with-pipe-error') {
      throw new ApiError('pipe-error');
    } else {
      res = await handle();
    }

    this.sequence.push('controller');

    return res;
  }
}
