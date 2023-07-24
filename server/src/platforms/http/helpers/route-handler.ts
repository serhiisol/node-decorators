import { Inject, Injectable } from '@decorators/di';

import { ApiError, Handler, HttpStatus, ParamMetadata, ParamValidator, Pipeline, ProcessPipe, toStandardType } from '../../../core';
import { HTTP_ADAPTER, ParameterType } from './constants';
import { HttpApplicationAdapter } from './http-application-adapter';
import { HttpContext } from './http-context';

@Injectable()
export class RouteHandler {
  constructor(
    @Inject(HTTP_ADAPTER) private adapter: HttpApplicationAdapter,
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
      const handlerParams = [];
      const context = new HttpContext(
        controller.constructor,
        controller[methodName],
        this.adapter,
        req,
        res,
        handlerParams,
      );

      handlerParams.push(...this.params(params, context, args));

      let message: unknown;

      try {
        await this.paramValidator.validate(params, handlerParams);

        message = await this.pipeline.run(
          pipes,
          () => handler(...handlerParams),
          context,
        );

        if (template) {
          return this.adapter.render(res, template, message);
        }
      } catch (error) {
        message = error;
      }

      if (this.adapter.isHeadersSent(res)) {
        return;
      }

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

    return status;
  }
}
