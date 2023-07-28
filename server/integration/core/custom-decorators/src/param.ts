import { createParamDecorator } from '@server';
import { HttpContext } from '@server/http';

export function Param() {
  return createParamDecorator((context: HttpContext) => {
    const req = context.getRequest();

    return req['query']?.['param'];
  });
}
