import { Injectable } from '@decorators/di';
import { plainToInstance } from 'class-transformer';
import { getMetadataStorage, validate } from 'class-validator';

import { ClassConstructor, Handler, ParamMetadata } from '../types';
import { BadRequestError } from './errors';

@Injectable()
export class ParamValidator {
  async validate(params: ParamMetadata[], args: any[]) {
    for (const [i, arg] of args.entries()) {
      const type = params[i].validator;

      if (!type) {
        continue;
      }

      if (this.validateSimple(arg, type as Handler)) {
        continue;
      }

      const instance = plainToInstance(type as ClassConstructor, arg);

      if (this.hasDecorators(type)) {
        const errors = await validate(instance, { validationError: { target: false } });

        if (errors.length) {
          throw new BadRequestError(`Invalid param “${params[i].argName}”`, errors);
        }

        continue;
      }

      if (instance instanceof type) {
        continue;
      }

      throw new BadRequestError(
        `Invalid param “${params[i].argName}”. “${params[i].validator.name}” expected, “${typeof arg}” received`,
      );
    }
  }

  private hasDecorators(type: Handler | ClassConstructor): boolean {
    const metadataStorage = getMetadataStorage();
    const metadatas = metadataStorage.getTargetValidationMetadatas(type, null, null, null);

    return metadatas.length > 0;
  }

  private validateSimple(arg: unknown, Type: Handler) {
    try {
      return typeof arg === typeof Type();
    } catch {
      return false;
    }
  }
}
