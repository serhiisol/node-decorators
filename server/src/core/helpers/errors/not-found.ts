import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class NotFoundError extends ApiError {
  status = HttpStatus.NOT_FOUND;
}
