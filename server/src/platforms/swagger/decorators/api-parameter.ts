import { OpenAPIV3_1 } from 'openapi-types';

import { Decorate } from '../../../core';
import { PROPERTY_API_PARAMETER_METADATA } from '../helpers';

export function ApiParameter(parameter: Pick<OpenAPIV3_1.ParameterObject, 'description'>) {
  return Decorate(PROPERTY_API_PARAMETER_METADATA, parameter);
}
