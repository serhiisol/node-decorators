import { Provider } from '@decorators/di';
import type { Server as HttpServer } from 'http';
import type { Http2SecureServer as Http2Server } from 'http2';
import type { Server as HttpsServer } from 'https';

export type ClassConstructor<T = object> = new (...args: any[]) => T;
export type Handler = (...args: unknown[]) => Promise<unknown> | unknown;

export type Server = HttpServer | HttpsServer | Http2Server;

export interface ModuleMetadata {
  controllers: ClassConstructor[];
  modules: ClassConstructor[];
  namespace?: string;
  providers: Provider[];
}

export interface ControllerOptions {
  ignoreVersion?: boolean;
}

export interface ControllerMetadata {
  options?: ControllerOptions;
  url?: string;
}

export interface MethodMetadata {
  methodName: string;
  returnType: ClassConstructor;
  type: string;
  url: string;
}

export type ValidatorFn = (arg: any) => Promise<boolean> | boolean;
export type Validator = Handler | ClassConstructor | ValidatorFn;

export interface ParamMetadata {
  // argument name defined in the function
  argName?: string;
  argType?: Handler | ClassConstructor;
  // If decorator is used multiple times over the same method
  callIndex: number;
  factory?: (context: any) => Promise<any> | any;
  index: number;
  methodName: string;
  paramName: string;
  paramType: string;
  paramValidator?: Validator;
}

export interface Metadata extends MethodMetadata {
  controller: ClassConstructor;
  module: ClassConstructor;
  params: ParamMetadata[];
  paths: string[];
  pipes: ClassConstructor[];
  url: string;
}
