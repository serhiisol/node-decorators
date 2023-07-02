import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class ForbiddenError extends ApiError {
  status = HttpStatus.FORBIDDEN;
}
