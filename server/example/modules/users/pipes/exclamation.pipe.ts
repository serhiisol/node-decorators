import { HttpContext, PipeHandle, ProcessPipe } from '@server';

export class ExclamationPipe implements ProcessPipe {
  run(_context: HttpContext, _handle: PipeHandle<string>) {
    console.log('Method ExclamationPipe Before');

    throw new Error('!!ERRROR!!');
  }
}
