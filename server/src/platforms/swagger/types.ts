import { OpenAPIV3_1 } from 'openapi-types';

import { ClassConstructor } from '../../core';

export interface SwaggerConfig {
  description?: string;
  path?: string;
  theme?: 'light' | 'dark' | 'auto';
  title?: string;
}

export interface ApiBasicResponse {
  description: string;
  type?: ClassConstructor;
}

export type ApiResponse = OpenAPIV3_1.ResponseObject & ApiBasicResponse;

export type ApiResponses = Record<number, ApiResponse>;
