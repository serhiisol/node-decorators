import {OpenApiClass, OpenApiMeta, SchemaMeta} from "./types";

export function getOpenApiMeta(target: OpenApiClass): OpenApiMeta {
  target.__openapi_meta__ = target.__openapi_meta__ || {};
  return target.__openapi_meta__;
}

export function getSchemaMeta(target: OpenApiClass): SchemaMeta {
  target.__openapi_schema_meta__ = target.__openapi_schema_meta__ || {};
  return target.__openapi_schema_meta__;
}
