import { ApiError, Injectable, PipeHandle, ProcessPipe, Reflector } from '@server';
import { HttpContext } from '@server/http';

@Injectable()
export class DecoratorPipe implements ProcessPipe {
  constructor(private reflector: Reflector) { }

  run(context: HttpContext, handle: PipeHandle<string>) {
    const decorated = this.reflector.getMetadata('decorated', context.getHandler());
    const req = context.getRequest();

    if (decorated === req['query']['param']) {
      return handle();
    }

    throw new ApiError('decorated-error');
  }
}
