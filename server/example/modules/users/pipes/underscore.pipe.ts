import { HttpContext, PipeHandle, ProcessPipe } from '../../../../src';

export class UnderscorePipe implements ProcessPipe {
  async run(_context: HttpContext, handle: PipeHandle<string>) {
    console.log('Method UnderscorePipe Before');

    const message = await handle();

    console.log('Method UnderscorePipe After', message);

    return `__${message}__`;
  }
}
