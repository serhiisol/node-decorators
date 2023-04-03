import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class NotFoundtError extends ApiError {
  status = HttpStatus.NOT_FOUND;
}
