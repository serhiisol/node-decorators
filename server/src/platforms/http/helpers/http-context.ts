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

  getArgs<T = unknown[]>() {
    return this.args as T;
  }

  getRequest<Req>() {
    return this.req as Req;
  }

  getResponse<Res>() {
    return this.res as Res;
  }

  async reply(message: unknown, status: number) {
    // make sure that message still can be replied
    if (await this.adapter.isHeadersSent(this.res)) {
      return;
    }

    return this.adapter.reply(this.res, message, status);
  }
}
