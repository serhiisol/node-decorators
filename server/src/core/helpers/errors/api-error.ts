import { HttpStatus } from '../constants';

export class ApiError extends Error {
  errors?: unknown[];
  status = HttpStatus.BAD_REQUEST;

  constructor(message?: string, errors?: unknown[]) {
    super(message);

    this.errors = errors;
  }

  toObject() {
    return {
      errors: this.errors,
      message: this.message,
    };
  }
}
