import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class InternalServerError extends ApiError {
  status = HttpStatus.INTERNAL_SERVER_ERROR;
}
