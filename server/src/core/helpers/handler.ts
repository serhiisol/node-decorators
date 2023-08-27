import { Handler, ParamMetadata } from '../types';
import { toStandardType } from '../utils';
import { HttpStatus } from './constants';
import { Context } from './context';
import { ApiError } from './errors';

export abstract class HandlerCreator {
  abstract getParam(param: ParamMetadata, args: unknown[]): Promise<unknown> | unknown;

  message(message: unknown) {
    if (message instanceof ApiError) {
      return message.toObject();
    }

    if (message instanceof Error) {
      return { message: message.message };
    }

    return message;
  }

  async params(metadata: ParamMetadata[], context: Context, args: unknown[]) {
    const params$ = metadata.map(param => param.factory
      ? param.factory(context)
      : this.getParam(param, args),
    );
    const params = await Promise.all(params$);

    return params.map(paramFn => toStandardType(paramFn()));
  }

  async runHandler(handler: Handler) {
    try {
      return await handler();
    } catch (error) {
      return error;
    }
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
}
