import { HttpContext, PipeHandle, ProcessPipe } from '../../../../src';

export class ExclamationPipe implements ProcessPipe {
  run(_context: HttpContext, _handle: PipeHandle<string>) {
    console.log('Method ExclamationPipe Before');

    throw new Error('!!ERRROR!!');

    // const message = await handle();

    // console.log('Method ExclamationPipe After', message);

    // return `!!${message}!!`;
  }
}
