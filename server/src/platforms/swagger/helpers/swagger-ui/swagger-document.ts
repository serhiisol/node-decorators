import { Inject, Injectable, Optional } from '@decorators/di';
import { OpenAPIV3_1 } from 'openapi-types';

import { APP_VERSION, ClassConstructor, Handler, Reflector } from '../../../../core';
import { MetadataScanner, ParameterType, RouteMetadata } from '../../../http';
import { ApiResponse, SwaggerConfig } from '../../types';
import { METHOD_API_RESPONSE_METADATA, METHOD_API_RESPONSES_METADATA, METHOD_API_SECURITY_METADATA, PROPERTY_API_PARAMETER_METADATA, SWAGGER_CONFIG } from '../constants';
import { getValidationMeta, isStandardType, pick, replaceUrlParameters, typeToContentType } from './utils';

@Injectable()
export class SwaggerDocument {
  private paths = {};
  private schemas = {};
  private securitySchemas = {};

  constructor(
    @Inject(APP_VERSION) @Optional() private appVersion: string,
    @Inject(SWAGGER_CONFIG) private config: SwaggerConfig,
    private metadataScanner: MetadataScanner,
    private reflector: Reflector,
  ) { }

  generate() {
    this.processMetadata();

    return {
      components: {
        schemas: this.schemas,
        securitySchemes: this.securitySchemas,
      },
      info: {
        description: this.config.description,
        title: this.config.title,
        version: this.appVersion,
      },
      openapi: '3.0.3',
      paths: this.paths,
    } as OpenAPIV3_1.Document;
  }

  private addSchema(type?: Handler | ClassConstructor) {
    if (type && !isStandardType(type) && !this.schemas[type.name]) {
      this.schemas[type.name] = this.getSchema(type);
    }
  }

  private getPath(route: RouteMetadata) {
    const simpleMeta = this.reflector.getMetadata(
      METHOD_API_RESPONSE_METADATA,
      route.controller.prototype[route.methodName],
    );
    const detailedMeta = this.reflector.getMetadata(
      METHOD_API_RESPONSES_METADATA,
      route.controller.prototype[route.methodName],
    );

    const ctrlMethod = `${route.controller.name}.${route.methodName}`;

    const bodyParam = route.params.find(param => param.paramType === ParameterType.BODY);
    const parameters = route.params
      .filter(param => param.paramType)
      .map(param => ({
        in: param.paramType,
        name: param.argName,
        required: param.paramType !== ParameterType.BODY,
        schema: this.getRefType(param.argType),
      } as OpenAPIV3_1.ParameterObject));

    const body = parameters.find(param => param.in === ParameterType.BODY);
    let requestBody: OpenAPIV3_1.RequestBodyObject;

    if (body) {
      parameters.splice(parameters.indexOf(body), 1);

      requestBody = {
        content: {
          [typeToContentType(bodyParam.argType)]: pick(body, 'schema'),
        },
      };
    }

    const preResponses = { [route.status]: { type: route.returnType, ...simpleMeta }, ...detailedMeta };
    const responses = Object.keys(preResponses).reduce((acc, status) => ({
      ...acc, [status]: this.toResponse(preResponses[status], route.methodName),
    }), {});

    const security = this.securitySchemas[ctrlMethod] ? [{ [ctrlMethod]: [] }] : [];

    return {
      parameters,
      requestBody,
      responses,
      security,
      tags: [route.controller.name],
    } as OpenAPIV3_1.OperationObject;
  }

  private getRefType(type?: Handler | ClassConstructor) {
    const typeName = type?.name;

    return this.schemas[typeName]
      ? { $ref: `#/components/schemas/${typeName}` }
      : { type: typeName?.toLowerCase() };
  }

  private getSchema(type: Handler | ClassConstructor) {
    const schema = {
      properties: {},
      required: [],
      title: type.name,
    } as OpenAPIV3_1.SchemaObject;

    const meta = getValidationMeta(type);

    if (!meta.length) {
      return schema;
    }

    const keys = new Set(meta.map(({ propertyName }) => propertyName));

    for (const key of [...keys]) {
      const validators = meta.filter(({ propertyName }) => propertyName === key);
      const parameterMeta = this.reflector.getMetadata(
        PROPERTY_API_PARAMETER_METADATA,
        type.prototype,
        key,
      );

      // applied validators
      const typeValidator = validators.find(({ name }) => name?.startsWith('is'));
      const minimum = validators.find(({ name }) => name === 'min');
      const maximum = validators.find(({ name }) => name === 'max');

      if (!validators.some(({ type }) => type.startsWith('conditional'))) {
        schema.required.push(key);
      }

      schema.properties[key] = {
        ...parameterMeta,
        maximum: maximum?.constraints[0],
        minimum: minimum?.constraints[0],
        type: typeValidator?.name.toLowerCase().replace('is', ''),
      } as OpenAPIV3_1.SchemaObject;
    }

    return schema;
  }

  private processMetadata() {
    const routeMetadata = this.metadataScanner.scan();

    for (const route of routeMetadata) {
      for (const param of route.params) {
        this.addSchema(param.argType);
      }

      this.addSchema(route.returnType);

      const meta = this.reflector.getMetadata(
        METHOD_API_SECURITY_METADATA,
        route.controller.prototype[route.methodName],
      );

      if (meta) {
        this.securitySchemas[`${route.controller.name}.${route.methodName}`] = meta;
      }

      const url = replaceUrlParameters(route.url);

      this.paths[url] = {
        ...(this.paths[url] ?? {}),
        [route.type]: this.getPath(route),
      };
    }
  }

  private toResponse(response: ApiResponse, description: string) {
    return {
      content: {
        [typeToContentType(response.type)]: {
          schema: this.getRefType(response.type),
        },
      },
      description: response.description ?? description,
    } as OpenAPIV3_1.ResponseObject;
  }
}
