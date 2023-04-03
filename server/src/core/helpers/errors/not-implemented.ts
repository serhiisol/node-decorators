import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class NotImplementedError extends ApiError {
  status = HttpStatus.NOT_IMPLEMENTED;
}
