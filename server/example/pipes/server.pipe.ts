import { HttpContext, PipeHandle, ProcessPipe } from '@server';
import { Response } from 'express';

export class ServerPipe implements ProcessPipe {
  async run(_context: HttpContext, handle: PipeHandle<string>) {
    console.log('ServerPipe');
    const res = _context.getResponse<Response>();

    try {
      const message = await handle();

      console.log('ServerPipe After', message);

      return message;
    } catch (e) {
      console.log('ServerPipe Error', e.message);

      // return e;
      res.status(500).send({ message: e.message, stack: e.stack.split('\n') });
    }
  }
}
