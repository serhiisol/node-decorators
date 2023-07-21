import { getOpenApiMeta } from "../meta";
import { ParamLocation, ParamOptions, ResponseDescriptor, SchemaDef } from "../types";

function basicDecoratorFactory(key: string, value: any): MethodDecorator {
  return (target: any, method: string, descriptor: any) => {
    const meta = getOpenApiMeta(target);
    const methodMeta: any = meta[method] = meta[method] || {};
    methodMeta[key] = value;
    return descriptor;
  }
}

export function Summary(summary: string): MethodDecorator {
  return basicDecoratorFactory('summary', summary);
}
export function Description(description: string): MethodDecorator {
  return basicDecoratorFactory('description', description);
}
export function Param(name: string, location: ParamLocation, options: ParamOptions = {}): MethodDecorator {
  return (target: any, method: string, descriptor: any) => {
    const meta = getOpenApiMeta(target);
    const methodMeta = meta[method] = meta[method] || {};
    const parameters = methodMeta.parameters = methodMeta.parameters || [];
    parameters.push({
      name,
      in: location,
      ...options,
    });
    return descriptor;
  }
}
export function Tags(tag: string, ...tags: string[]): MethodDecorator {
  return basicDecoratorFactory('tags', [tag, ...(tags || [])]);
}
export function Deprecated(urls?: string[]): MethodDecorator {
  if (urls) return basicDecoratorFactory('deprecated', urls);
  return basicDecoratorFactory('deprecated', true);
}
export function BodyContent(mediaType: string, schema: SchemaDef): MethodDecorator {
  return (target: any, method: string, descriptor: any) => {
    const meta = getOpenApiMeta(target);
    const methodMeta = meta[method] = meta[method] || {};
    const requestBody = methodMeta.requestBody = methodMeta.requestBody || { content: { } };
    requestBody.content[mediaType] = { schema };
    return descriptor;
  }
}
export function Responses(def: { [key: string]: ResponseDescriptor }): MethodDecorator {
  return basicDecoratorFactory('responses', def);
}
export function OpenApiResponse(status: string | number, description: string): MethodDecorator;
export function OpenApiResponse(status: string | number, produces: string, schema: SchemaDef): MethodDecorator;
export function OpenApiResponse(status: string | number, descriptionOrProduces: string, schema?: SchemaDef): MethodDecorator {
  return (target: any, method: string, descriptor: any) => {
    const meta = getOpenApiMeta(target);
    const methodMeta = meta[method] = meta[method] || {};
    const responses = methodMeta.responses = methodMeta.responses || {};
    const thisResponse = responses[status.toString()] = responses[status.toString()] || {
      description: '',
      content: {}
    };
    if (!schema) { // we're changing the description of a response
      thisResponse.description = descriptionOrProduces;
    } else { // we're defining what is the schema of the response
      thisResponse.content[descriptionOrProduces] = { schema };
    }
    return descriptor;
  }
}
export function Security(schemeName: string, scopes?: string[]): MethodDecorator {
  return (target: any, method: string, descriptor: any) => {
    const meta = getOpenApiMeta(target);
    const methodMeta = meta[method] = meta[method] || {};
    const security = methodMeta.security = methodMeta.security || [];
    security.push({
      [schemeName]: scopes || []
    });
    return descriptor;
  }
}
