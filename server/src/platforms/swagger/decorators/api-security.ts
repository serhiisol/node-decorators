import { OpenAPIV3_1 } from 'openapi-types';

import { Decorate } from '../../../core';
import { METHOD_API_SECURITY_METADATA } from '../helpers';

export function ApiSecurity(security: OpenAPIV3_1.SecuritySchemeObject) {
  return Decorate(METHOD_API_SECURITY_METADATA, security);
}

export function ApiBearerAuth() {
  return Decorate(METHOD_API_SECURITY_METADATA, {
    scheme: 'bearer',
    type: 'http',
  } as OpenAPIV3_1.SecuritySchemeObject);
}
