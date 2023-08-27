import { ClassConstructor, Handler, MethodMetadata, ParamMetadata } from '../../core';

export type AckFunction = (...args: any[]) => void;

export interface EventMetadata extends MethodMetadata {
  controller: ClassConstructor;
  event?: string;
  module: ClassConstructor;
  params: ParamMetadata[];
  pipes: ClassConstructor[];
}

export interface AdapterEvent {
  event: string;
  handler: Handler;
  type: string;
  url: string;
}
