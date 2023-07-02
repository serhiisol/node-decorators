import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class UnauthorizedError extends ApiError {
  status = HttpStatus.UNAUTHORIZED;
}
