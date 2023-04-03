import { Context } from '../context';

export type PipeHandle<T = unknown> = () => Promise<T>;

export abstract class ProcessPipe {
  abstract run(context: Context, handle: PipeHandle): Promise<unknown> | unknown;
}
