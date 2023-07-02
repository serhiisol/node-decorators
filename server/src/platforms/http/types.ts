import { ClassConstructor, ParamMetadata } from '../../core';

export interface RouteMetadata {
  controller: ClassConstructor;
  methodName: string;
  module: ClassConstructor;
  params: ParamMetadata[];
  pipes: ClassConstructor[];
  status?: number;
  template?: string;
  type: string;
  url: string;
}
