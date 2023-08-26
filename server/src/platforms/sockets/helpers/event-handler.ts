import { Inject, Injectable, Optional } from '@decorators/di';

import { ApiError, GLOBAL_PIPE, Handler, ParamMetadata, ParamValidator, Pipeline, ProcessPipe, toStandardType } from '../../../core';
import { AckFunction } from '../types';
import { ParameterType, SOCKETS_ADAPTER } from './constants';
import { SocketsApplicationAdapter } from './sockets-application-adapter';
import { SocketsContext } from './sockets-context';

@Injectable()
export class EventHandler {
  constructor(
    @Inject(SOCKETS_ADAPTER) private adapter: SocketsApplicationAdapter,
    @Inject(GLOBAL_PIPE) @Optional() private pipes: ProcessPipe[] = [],
    private pipeline: Pipeline,
    private paramValidator: ParamValidator,
  ) { }

  createHandler(
    controller: InstanceType<any>,
    methodName: string,
    params: ParamMetadata[],
    pipes: ProcessPipe[],
  ): Handler {
    const handler = controller[methodName].bind(controller);

    return async (...args: unknown[]) => {
      const server = await this.adapter.getParam(ParameterType.SERVER, null, ...args);
      const socket = await this.adapter.getParam(ParameterType.SOCKET, null, ...args);
      const ack = await this.adapter.getParam(ParameterType.ACK, null, ...args);

      const verifiedParams = [];
      const context = new SocketsContext(
        controller.constructor,
        controller[methodName],
        this.adapter,
        server(),
        socket(),
        args.slice(1),
      );

      let message = await this.runHandler(async () => {
        verifiedParams.push(...await this.params(params, context, args));

        await this.paramValidator.validate(params, verifiedParams);
      });

      // Runs either all the pipes with the handler if validation was successfully completed
      // or just global pipes with validation error
      const eventHandler = () => {
        if (message) {
          throw message;
        }

        return handler(...verifiedParams);
      };

      message = await this.runHandler(() =>
        this.pipeline.run(this.pipes.concat(message ? [] : pipes), context, eventHandler),
      );

      if (message instanceof Error) {
        await context.emit('error', this.message(message));

        return;
      }

      const reply = ack() as AckFunction;

      if (reply) {
        return reply(message);
      }
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

  async params(metadata: ParamMetadata[], context: SocketsContext, args: unknown[]) {
    let indexOverride = 0;

    const params$ = metadata
      .sort((a, b) => a.index - b.index)
      .map(param => {
        if (param.factory) {
          return param.factory(context);
        }

        let index = param.index;

        if (param.paramType === ParameterType.PARAM) {
          index = indexOverride;

          indexOverride++;
        }

        return this.adapter.getParam(param.paramType as ParameterType, index, ...args);
      });

    const params = await Promise.all(params$);

    return params.map(paramFn => toStandardType(paramFn()));
  }

  private async runHandler(handler: Handler) {
    try {
      return await handler();
    } catch (error) {
      return error;
    }
  }
}
