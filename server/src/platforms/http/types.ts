import { ClassConstructor, Handler, MethodMetadata, ParamMetadata } from '../../core';

export interface RouteMetadata extends MethodMetadata {
  controller: ClassConstructor;
  module: ClassConstructor;
  params: ParamMetadata[];
  pipes: ClassConstructor[];
  status?: number;
  template?: string;
}

export interface AdapterRoute {
  handler: Handler;
  type: string;
  url: string;
}
