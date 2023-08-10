import { Inject, Injectable, Optional } from '@decorators/di';

import { ApiError, GLOBAL_PIPE, Handler, HttpStatus, ParamMetadata, ParamValidator, Pipeline, ProcessPipe, toStandardType } from '../../../core';
import { HTTP_ADAPTER, ParameterType } from './constants';
import { HttpApplicationAdapter } from './http-application-adapter';
import { HttpContext } from './http-context';

@Injectable()
export class RouteHandler {
  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
    @Inject(GLOBAL_PIPE) @Optional() private pipes: ProcessPipe[] = [],
    private pipeline: Pipeline,
    private paramValidator: ParamValidator,
  ) { }

  createHandler(
    controller: InstanceType<any>,
    methodName: string,
    params: ParamMetadata[],
    pipes: ProcessPipe[],
    status = HttpStatus.OK,
    template?: string,
  ): Handler {
    const handler = controller[methodName].bind(controller);

    return async (...args: unknown[]) => {
      const req = this.adapter.getParam(ParameterType.REQUEST, null, ...args);
      const res = this.adapter.getParam(ParameterType.RESPONSE, null, ...args);

      const verifiedParams = [];
      const context = new HttpContext(
        controller.constructor,
        controller[methodName],
        this.adapter,
        req,
        res,
        verifiedParams,
      );

      let message = await this.runHandler(async () => {
        verifiedParams.push(...await this.params(params, context, args));

        await this.paramValidator.validate(params, verifiedParams);
      });

      // Runs either all the pipes with the handler if validation was successfully completed
      // or just global pipes with validation error
      const routeHandler = async () => {
        if (message) {
          throw message;
        }

        message = await handler(...verifiedParams);

        if (await this.adapter.isHeadersSent(res) || !template) {
          return message;
        }

        this.adapter.setHeader(res, 'Content-Type', 'text/html');

        return this.adapter.render(res, template, message);
      };

      message = await this.runHandler(() =>
        this.pipeline.run(this.pipes.concat(message ? [] : pipes), context, routeHandler),
      );

      await context.reply(this.message(message), this.status(message, status));
    };
  }

  message(message: unknown) {
    if (message instanceof ApiError) {
      return message.toObject();
    }

    if (message instanceof Error) {
      return { message: message.message };
    }

    return message;
  }

  async params(metadata: ParamMetadata[], context: HttpContext, args: unknown[]) {
    const params$ = metadata
      .sort((a, b) => a.index - b.index)
      .map(async param => param.factory
        ? await param.factory(context)
        : await this.adapter.getParam(param.paramType as ParameterType, param.paramName, ...args),
      );
    const params = await Promise.all(params$);

    return params.map(toStandardType);
  }

  status(message: unknown, status: number) {
    if (message instanceof ApiError) {
      return message.status;
    }

    if (message instanceof Error) {
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    return status;
  }

  private async runHandler(handler: Handler) {
    try {
      return await handler();
    } catch (error) {
      return error;
    }
  }
}
