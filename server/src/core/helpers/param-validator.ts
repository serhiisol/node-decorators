import { Injectable } from '@decorators/di';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { ClassConstructor, Handler, ParamMetadata } from '../types';
import { BadRequestError } from './errors';

@Injectable()
export class ParamValidator {
  async validate(params: ParamMetadata[], args: any[]) {
    for (const [i, arg] of args.entries()) {
      const type = params[i].validator;

      if (!type) {
        return;
      }

      if (this.validateSimple(arg, type as Handler)) {
        return;
      }

      const instance = plainToInstance(type as ClassConstructor, arg);

      if (instance instanceof type) {
        const errors = await validate(instance, { validationError: { target: false } });

        if (errors.length) {
          throw new BadRequestError(`Invalid param “${params[i].argName}”`, errors);
        }

        return;
      }

      throw new BadRequestError(
        `Invalid param “${params[i].argName}”. “${params[i].validator.name}” expected, “${typeof arg}” received`,
      );
    }
  }

  private validateSimple(arg: unknown, Type: Handler) {
    try {
      return typeof arg === typeof Type();
    } catch {
      return false;
    }
  }
}
