import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class BadRequestError extends ApiError {
  status = HttpStatus.BAD_REQUEST;
}
