import { Injectable, PipeHandle, ProcessPipe, Reflector, UnauthorizedError } from '@server';
import { HttpContext } from '@server/http';
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

    throw new UnauthorizedError('unauthorized');
  }
}
