import { createParamDecorator } from '@server';
import { HttpContext } from '@server/http';
import { Request } from 'express';

export function AccessParam() {
  return createParamDecorator((context: HttpContext) => {
    const req = context.getRequest<Request>();

    return req.query.access;
  });
}
