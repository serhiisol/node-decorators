import { Request } from 'express';

import { HttpContext, Injectable, PipeHandle, ProcessPipe } from '../../../../src';
import { ApiError, Reflector } from '../../../../src/core';

@Injectable()
export class AccessPipe implements ProcessPipe {
  constructor(private reflector: Reflector) { }

  async run(context: HttpContext, handle: PipeHandle<string>) {
    const access = this.reflector.getMetadata('access', context.getHandler());
    const req = context.getRequest<Request>();

    if (access === req.query.access) {
      return handle();
    }

    throw new ApiError('unauthorized');
  }
}
