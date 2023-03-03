import { Container, InjectionToken } from "@decorators/di";
import { Express } from 'express';
import * as swaggerUi from "swagger-ui-express";
import { OpenApiOptions, SchemaDef } from "./types";

export const OPENAPI_DOCUMENT = new InjectionToken('openapi_doc');
export function getOpenApiDoc(): Promise<any> | any {
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

export async function enableOpenApi(app: Express, options: OpenApiOptions = {}) {
  const doc = await getOpenApiDoc();
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
    security: options.security,
  });
  
  Object.assign(doc.components, {
    securitySchemes: options.components?.securitySchemes
  });

  // setup swagger UI
  const serveOnPath = options.serveOnPath || '/api-docs';
  app.use(serveOnPath, swaggerUi.serve, swaggerUi.setup(doc));
}

export async function registerSchema(name: string, schema: SchemaDef): Promise<void> {
  const doc = await getOpenApiDoc();
  const schemas = doc.components.schemas = doc.components.schemas || {};
  schemas[name] = schema;
}
