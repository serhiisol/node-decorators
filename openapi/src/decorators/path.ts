import {getOpenApiMeta, Param, ParamLocation, ParamOptions, RequestBody, ResponseDescriptor} from "../meta";
import {Schema} from "../helpers";

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
export function Parameters(params: Param[]): MethodDecorator {
  return basicDecoratorFactory('parameters', params);
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
export function RequestBody(bodyDefinition: RequestBody): MethodDecorator {
  return basicDecoratorFactory('requestBody', bodyDefinition);
}
export function BodyContent(mediaType: string, schema: Schema): MethodDecorator {
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
export function OpenApiResponse(status: string | number, produces: string, schema: Schema): MethodDecorator;
export function OpenApiResponse(status: string | number, descriptionOrProduces: string, schema?: Schema): MethodDecorator {
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
