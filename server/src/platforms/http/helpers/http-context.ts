import { ClassConstructor, Context, Handler } from '../../../core';
import { HttpApplicationAdapter } from './http-application-adapter';

export class HttpContext extends Context {
  constructor(
    protected controller: ClassConstructor,
    protected handler: Handler,
    protected adapter: HttpApplicationAdapter,
    protected req: unknown,
    protected res: unknown,
    protected args: unknown[],
  ) {
    super(controller, handler);
  }

  getArgs<T>() {
    return this.args as T;
  }

  getRequest<Req>() {
    return this.req as Req;
  }

  getResponse<Res>() {
    return this.res as Res;
  }

  reply(message: unknown, status: number) {
    return this.adapter.reply(this.res, message, status);
  }
}
