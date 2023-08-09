import { ClassConstructor, Decorate } from '../../../core';
import { METHOD_API_RESPONSE_METADATA, METHOD_API_RESPONSES_METADATA } from '../helpers';
import { ApiBasicResponse, ApiResponses } from '../types';

export function ApiResponse(description: string, type?: ClassConstructor) {
  return Decorate(METHOD_API_RESPONSE_METADATA, {
    description, type,
  } as ApiBasicResponse);
}

export function ApiResponseSchema(responses: ApiResponses) {
  return Decorate(METHOD_API_RESPONSES_METADATA, responses);
}
