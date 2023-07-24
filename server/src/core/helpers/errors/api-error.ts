import { ValidationError } from 'class-validator';

import { HttpStatus } from '../constants';

export class ApiError extends Error {
  errors?: ValidationError[];
  status = HttpStatus.BAD_REQUEST;

  constructor(message?: string, errors?: ValidationError[]) {
    super(message);

    this.errors = errors;
  }

  toObject() {
    return { message: this.message, errors: this.errors };
  }
}
