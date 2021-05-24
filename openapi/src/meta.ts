import {Properties, Schema } from "./helpers";

export type ParamLocation = 'query' | 'header' | 'path' | 'cookie';

export type ParamOptions = {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
};

export type Param = {
  name: string;
  in: ParamLocation;
} & ParamOptions;

export type Content = {
  [mediaType: string]: { schema: Schema }
};

export type RequestBody = {
  description?: string;
  required?: boolean;
  content: Content;
}

export type ResponseDescriptor = {
  description: string;
  content: Content;
}

export type PathMeta = {
  summary?: string;
  description?: string;
  parameters?: Param[];
  tags?: string[];
  deprecated?: true | string[],
  requestBody?: RequestBody;
  responses?: { [httpStatus: string]: ResponseDescriptor };
}

export type OpenApiMeta = {
  [methodName: string]: PathMeta;
}

export type SchemaMeta = {
  properties?: Properties;
  required?: string[];
}

export interface OpenApiClass {
  __openapi_meta__?: OpenApiMeta;
  __openapi_schema_meta__?: SchemaMeta;
}

export function getOpenApiMeta(target: OpenApiClass): OpenApiMeta {
  target.__openapi_meta__ = target.__openapi_meta__ || {};
  return target.__openapi_meta__;
}

export function getSchemaMeta(target: OpenApiClass): SchemaMeta {
  target.__openapi_schema_meta__ = target.__openapi_schema_meta__ || {};
  return target.__openapi_schema_meta__;
}
