import { HttpStatus } from '../constants';
import { ApiError } from './api-error';

export class BadGatewayError extends ApiError {
  status = HttpStatus.BAD_GATEWAY;
}
