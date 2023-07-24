import { OpenAPIV3_1 } from 'openapi-types';

import { Decorate } from '../../../core';
import { METHOD_API_OPERATION_METADATA } from '../helpers';

export function ApiOperation(operation: OpenAPIV3_1.OperationObject) {
  return Decorate(METHOD_API_OPERATION_METADATA, operation);
}
