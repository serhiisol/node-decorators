import { Decorate, methodDecoratorFactory } from '../../../core';
import { HttpMethodType, METHOD_TEMPLATE_METADATA, SOURCE_TYPE } from '../helpers';

export function Delete(url = '', status?: number) {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    status,
    type: HttpMethodType.DELETE,
    url,
  });
}

export function Get(url = '', status?: number) {
  return methodDecoratorFactory({
    status,
    type: HttpMethodType.GET,
    url,
  });
}

export function Head(url = '', status?: number) {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    status,
    type: HttpMethodType.HEAD,
    url,
  });
}

export function Options(url = '', status?: number) {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    status,
    type: HttpMethodType.OPTIONS,
    url,
  });
}

export function Patch(url = '', status?: number) {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    status,
    type: HttpMethodType.PATCH,
    url,
  });
}

export function Post(url = '', status?: number) {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    status,
    type: HttpMethodType.POST,
    url,
  });
}

export function Put(url = '', status?: number) {
  return methodDecoratorFactory({
    source: SOURCE_TYPE,
    status,
    type: HttpMethodType.PUT,
    url,
  });
}

export function Render(template: string) {
  return Decorate(METHOD_TEMPLATE_METADATA, template);
}
