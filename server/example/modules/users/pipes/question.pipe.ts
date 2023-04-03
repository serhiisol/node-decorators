import { HttpContext, PipeHandle, ProcessPipe } from '../../../../src';

export class QuestionPipe implements ProcessPipe {
  async run(_context: HttpContext, handle: PipeHandle<string>) {
    console.log('Controller QuestionPipe Before');

    const message = await handle();

    console.log('Controller QuestionPipe After', message);

    return `??${message}??`;
  }
}
