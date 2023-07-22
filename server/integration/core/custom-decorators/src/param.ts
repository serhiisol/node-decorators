import { createParamDecorator, HttpContext } from '@server';

export function Param() {
  return createParamDecorator((context: HttpContext) => {
    const req = context.getRequest();

    return req['query']?.['param'];
  });
}
