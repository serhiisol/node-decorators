import { ClassConstructor, MethodMetadata, ParamMetadata } from '../../core';

export interface RouteMetadata extends MethodMetadata {
  controller: ClassConstructor;
  module: ClassConstructor;
  params: ParamMetadata[];
  pipes: ClassConstructor[];
  status?: number;
  template?: string;
}
