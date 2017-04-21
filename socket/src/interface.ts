export enum MiddlewareType {
  IO,
  Socket,
  Controller
}

/**
 * Parameter types enum
 */
export enum ParameterType {
  IO,
  Socket,
  Args,
  Callback
}

export interface Param {
  method: string | symbol;
  type: ParameterType;
  index: number;
  data?: any;
}

export enum EventType {
  IO,
  Socket
}

export interface Middleware {
  type: MiddlewareType;
  middleware: Function[];
}

export interface Listener {
  event: string;
  type: EventType;
  method: string | symbol;
  middleware: Function[];
}

export interface Injectable {
  provide: SocketIOClass;
  deps: any[];
}

export class Meta {

  serverOrPort: number| SocketIO.Server;

  options: any;

  /**
   * Namespace
   * @type {string}
   */
  ns: string;

  /**
   * Middleware
   */
  middleware: Middleware[] = [];

  /**
   * Event listeners
   */
  listeners: Listener[] = [];

  params: Param[] = [];
}

export interface SocketIOClass extends Object {
  __socket_meta__: Meta;

  new (...deps: any[]);
}

export interface DecoratorsArtifacts {
  controller: SocketIOClass;
  meta: Meta;
}

export const DEFAULT_NAMESPACE = '/';
