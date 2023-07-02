import { Context } from '../context';


export type PipeHandle<T = unknown> = () => Promise<T>;

/**
 * Pipes allow to add additional interceptors before and after main route function.
 * In order to implement a pipe import `ProcessPipe` interface and implement it like so:
 *
 * Example:
 *
 * ...
 * import { HttpContext, PipeHandle, ProcessPipe } from '@decorators/server';
 *
 * export class QuestionPipe implements ProcessPipe {
 *   async run(_context: HttpContext, handle: PipeHandle<string>) {
 *     const message = await handle();
 *
 *     return `??${message}??`;
 *   }
 * }
 *
 * ...
 *
 * @Pipe(QuestionPipe)
 * process(@Body() body: object)
 * ...
 */
export abstract class ProcessPipe {
  abstract run(context: Context, handle: PipeHandle): Promise<unknown> | unknown;
}
