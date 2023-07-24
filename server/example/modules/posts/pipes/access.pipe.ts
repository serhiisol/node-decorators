import { ApiError, HttpContext, Injectable, PipeHandle, ProcessPipe, Reflector } from '@server';
import { Request } from 'express';

@Injectable()
export class AccessPipe implements ProcessPipe {
  constructor(private reflector: Reflector) { }

  run(context: HttpContext, handle: PipeHandle<string>) {
    const access = this.reflector.getMetadata('access', context.getHandler());
    const req = context.getRequest<Request>();

    if (access === req.query.access) {
      return handle();
    }

    throw new ApiError('unauthorized');
  }
}
