import { PipeHandle, ProcessPipe } from '@server';
import { HttpContext } from '@server/http';

export class ExclamationPipe implements ProcessPipe {
  run(_context: HttpContext, _handle: PipeHandle<string>) {
    console.log('Method ExclamationPipe Before');

    throw new Error('!!ERRROR!!');
  }
}
