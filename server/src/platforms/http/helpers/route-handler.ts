import { Inject, Injectable, Optional } from '@decorators/di';

import { ApiError, GLOBAL_PIPE, Handler, HttpStatus, ParamMetadata, ParamValidator, Pipeline, ProcessPipe, toStandardType } from '../../../core';
import { HTTP_ADAPTER, ParameterType } from './constants';
import { HttpApplicationAdapter } from './http-application-adapter';
import { HttpContext } from './http-context';

@Injectable()
export class RouteHandler {
  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
    @Inject(GLOBAL_PIPE) @Optional() private globalPipes: ProcessPipe[] = [],
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

      let message = await this.runHandlerSafe(async () => {
        verifiedParams.push(...this.params(params, context, args));

        await this.paramValidator.validate(params, verifiedParams);
      });

      // Runs either all the pipes with the handler if validation was successfully completed
      // or just global pipes with validation error
      message = await this.runHandlerSafe(() =>
        this.pipeline.run(this.globalPipes.concat(message ? [] : pipes), context, async () => {
          if (message) {
            throw message;
          }

          message = await handler(...verifiedParams);

          return template
            ? this.adapter.render(res, template, message)
            : message;
        }),
      );

      await context.reply(
        this.message(message),
        this.status(message, status),
      );
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

  params(params: ParamMetadata[], context: HttpContext, args: unknown[]) {
    return params
      .sort((a, b) => a.index - b.index)
      .map(param => param.factory
        ? param.factory(context)
        : this.adapter.getParam(param.paramType as ParameterType, param.paramName, ...args),
      )
      .map(toStandardType);
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

  private async runHandlerSafe(handler: Handler) {
    try {
      return await handler();
    } catch (error) {
      return error;
    }
  }
}
