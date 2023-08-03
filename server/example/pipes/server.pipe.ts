import { ApiError, HttpStatus, PipeHandle, ProcessPipe } from '@server';
import { HttpContext } from '@server/http';
import { Response } from 'express';

export class ServerPipe implements ProcessPipe {
  async run(context: HttpContext, handle: PipeHandle<string>) {
    const res = context.getResponse<Response>();

    try {
      return await handle();
    } catch (e) {
      if (e instanceof ApiError) {
        res.status(e.status).send(e.toObject());
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: e.message, stack: e.stack.split('\n') });
      }
    }
  }
}
