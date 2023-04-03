import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class NotAllowedError extends ApiError {
  status = HttpStatus.NOT_ALLOWED;
}
