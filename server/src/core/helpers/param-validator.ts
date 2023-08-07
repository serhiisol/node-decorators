import { Injectable } from '@decorators/di';
import { plainToInstance } from 'class-transformer';
import { getMetadataStorage, validate } from 'class-validator';

import { ClassConstructor, Handler, ParamMetadata } from '../types';
import { isClass, isFunction } from '../utils';
import { BadRequestError } from './errors';

@Injectable()
export class ParamValidator {
  async validate(params: ParamMetadata[], args: any[]) {
    for (const [i, arg] of args.entries()) {
      const validator = params[i].paramValidator;
      const type = isClass(validator) ? validator : params[i].argType;

      if (isFunction(validator)) {
        await this.useFunctionValidator(params[i], arg);
      }

      if (this.hasDecorators(type)) {
        await this.useMetadataValidator(type as ClassConstructor, params[i], arg);
      }
    }
  }

  private hasDecorators(type: Handler | ClassConstructor): boolean {
    const metadataStorage = getMetadataStorage();
    const metadatas = metadataStorage.getTargetValidationMetadatas(type, null, null, null);

    return metadatas.length > 0;
  }

  private async useFunctionValidator(meta: ParamMetadata, arg: any) {
    if (await (meta.paramValidator as Handler)(arg)) {
      return;
    }

    throw new BadRequestError(
      `Invalid param "${meta.argName}". "${typeof arg}" received`,
    );
  }

  private async useMetadataValidator(type: ClassConstructor, meta: ParamMetadata, arg: any) {
    const instance = plainToInstance(type, arg);

    if (this.hasDecorators(type)) {
      const errors = await validate(instance, { validationError: { target: false } });

      if (errors.length) {
        throw new BadRequestError(`Invalid param "${meta.argName}".`, errors);
      }
    }
  }
}
