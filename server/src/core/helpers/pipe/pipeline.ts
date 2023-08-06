import { Handler } from '../../types';
import { Context } from '../context';
import { ProcessPipe } from './pipe';

export class Pipeline {
  run(
    pipes: ProcessPipe[],
    context: Context,
    handler: Handler,
  ): Promise<unknown> {
    const next = (i = 0) => {
      return i >= pipes.length ? handler() : pipes[i].run(context, () => next(i + 1));
    };

    return next();
  }
}
