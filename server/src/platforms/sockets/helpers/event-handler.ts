import { Inject, Injectable, Optional } from '@decorators/di';

import { GLOBAL_PIPE, Handler, HandlerCreator, ParamMetadata, ParamValidator, Pipeline, ProcessPipe } from '../../../core';
import { AckFunction } from '../types';
import { ParameterType, SOCKETS_ADAPTER } from './constants';
import { SocketsApplicationAdapter } from './sockets-application-adapter';
import { SocketsContext } from './sockets-context';

@Injectable()
export class EventHandler extends HandlerCreator {
  constructor(
    @Inject(SOCKETS_ADAPTER) private adapter: SocketsApplicationAdapter,
    @Inject(GLOBAL_PIPE) @Optional() private pipes: ProcessPipe[] = [],
    private pipeline: Pipeline,
    private paramValidator: ParamValidator,
  ) {
    super();
  }

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

  getParam(param: ParamMetadata, args: unknown[]): unknown {
    return this.adapter.getParam(param.paramType as ParameterType, param.callIndex, ...args);
  }
}
