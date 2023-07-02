import { Provider } from '@decorators/di';

export type ClassConstructor<T = object> = new (...args: any[]) => T;
export type Handler = (...args: unknown[]) => Promise<unknown> | unknown;

export interface ModuleMetadata {
  controllers: ClassConstructor[];
  modules: ClassConstructor[];
  namespace?: string;
  providers: Provider[];
}

export interface ControllerMetadata {
  options?: Record<string, unknown>;
  url?: string;
}

export interface MethodMetadata {
  methodName: string;
  status: number;
  type: string;
  url: string;
}

export interface ParamMetadata {
  // argument name defined in the function
  argName?: string;
  factory?: (context: any) => unknown;
  index: number;
  methodName: string;
  paramName: string;
  paramType: string;
  validator?: Handler | ClassConstructor;
}
