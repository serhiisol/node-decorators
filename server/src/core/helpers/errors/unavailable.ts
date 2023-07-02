import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class UnavailableError extends ApiError {
  status = HttpStatus.UNAVAILABLE;
}
