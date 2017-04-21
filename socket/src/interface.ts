export const DEFAULT_NAMESPACE = '/';

export enum MiddlewareType {
  IO,
  Socket,
  Controller
}

export interface Middleware {
  type: MiddlewareType;
  middleware: Function[];
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

export interface Listener {
  event: string;
  type: EventType;
  method: string | symbol;
  middleware: Function[];
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

export interface Injectable {
  provide: SocketIOClass;
  deps: any[];
}

export interface DecoratorsArtifacts {
  controller: SocketIOClass;
  meta: Meta;
}
