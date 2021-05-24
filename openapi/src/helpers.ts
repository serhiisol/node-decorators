import { Container, InjectionToken } from "@decorators/di";
import { Express } from 'express';
import * as swaggerUi from "swagger-ui-express";

type OpenApiOptions = {
  serveOnPath?: string;
  info?: {
    title?: string;
    description?: string;
    version?: string;
  };
  tags?: { name: string, description?: string }[];
  servers?: { url: string, description?: string }[];
  externalDocs?: { url: string, description?: string; };
}

type Type = 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object';

type Ref = {
  $ref: string;
};
type OneOf = {
  oneOf: Array<Type | Ref>;
};
type AnyOf = {
  anyOf: Array<Type | Ref>;
};
type AllOf = {
  allOf: Array<Type | Ref>;
};
type Not = {
  not: Type | Ref;
}

type CommonAttrs<T> = {
  default?: T;
  example?: T;
  readOnly?: boolean;
  writeOnly?: boolean;
  deprecated?: boolean;
}

type StringAttrs = {
  minLength?: number;
  maxLength?: number;
  format?: string;
  pattern?: string;
  enum?: string[];
} & CommonAttrs<string>;
type NumericAttrs = {
  minimum?: number;
  maximum?: number;
  format?: string;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
} & CommonAttrs<number>;
type ArrayAttrs = {
  items: Schema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;
} & CommonAttrs<any[]>
type ObjectAttrs = {
  properties?: Properties;
  required?: string[];
} & CommonAttrs<object>;
export type StringSchema = { type: 'string' } & StringAttrs;
export type NumericSchema = { type: 'number' | 'integer' } & NumericAttrs;
export type BooleanSchema = { type: 'boolean' } & CommonAttrs<boolean>;
export type ArraySchema = { type: 'array' } & ArrayAttrs;
export type ObjectSchema = { type: 'object' } & ObjectAttrs;
export type Schema = Ref | OneOf | AnyOf | AllOf | Not |
  StringSchema | NumericSchema | BooleanSchema | ArraySchema | ObjectSchema;
export type Properties = {
  [key: string]: Schema;
}

export const OPENAPI_DOCUMENT = new InjectionToken('openapi_doc');
export function getOpenApiDoc(): any {
  try {
    return Container.get(OPENAPI_DOCUMENT);
  } catch (error) {
    const doc: any = {
      openapi: '3.0.3',
      tags: [],
      paths: {},
      security: [],
      components: {},
    };
    Container.provide([{
      provide: OPENAPI_DOCUMENT,
      useValue: doc,
    }]);
    return doc;
  }
}

export function enableOpenApi(app: Express, options: OpenApiOptions = {}) {
  const doc = getOpenApiDoc();
  // add the basics
  Object.assign(doc, {
    info: {
      title: options.info?.title || process.env.npm_package_name,
      description: options.info?.description || process.env.npm_package_description,
      version: options.info?.version || process.env.npm_package_version
    },
    tags: options.tags,
    servers: options.servers,
    externalDocs: options.externalDocs,
  });

  // setup swagger UI
  const serveOnPath = options.serveOnPath || '/api-docs';
  app.use(serveOnPath, swaggerUi.serve, swaggerUi.setup(doc));
}

export function registerSchema(name: string, schema: Schema): void {
  const doc = getOpenApiDoc();
  const schemas = doc.components.schemas = doc.components.schemas || {};
  schemas[name] = schema;
}
