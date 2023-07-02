import { Request } from 'express';

import { createParamDecorator, HttpContext } from '../../../../src';

export function AccessParam() {
  return createParamDecorator((context: HttpContext) => {
    const req = context.getRequest<Request>();

    return req.query.access;
  });
}
