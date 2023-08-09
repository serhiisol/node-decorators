import { Provider } from '@decorators/di';

export type ClassConstructor<T = object> = new (...args: any[]) => T;
export type Handler = (...args: unknown[]) => Promise<unknown> | unknown;

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
  factory?: (context: any) => Promise<any> | any;
  index: number;
  methodName: string;
  paramName: string;
  paramType: string;
  paramValidator?: Validator;
}
