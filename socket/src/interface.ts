/**
 * All possible middleware types
 *
 * @export
 * @enum {number}
 */
export enum MiddlewareType {
  IO,
  Socket,
  Controller
}

/**
 * Middleware
 *
 * @export
 * @interface Middleware
 */
export interface Middleware {
  type: MiddlewareType;
  middleware: Function[];
}

/**
 * Parameter types enum
 *
 * @export
 * @enum {number}
 */
export enum ParameterType {
  IO,
  Socket,
  Args,
  Ack
}

/**
 * Registered params
 *
 * @export
 * @interface Param
 */
export interface Param {
  method: string | symbol;
  type: ParameterType;
  index: number;
  data?: any;
}

/**
 * Event types
 *
 * @export
 * @enum {number}
 */
export enum EventType {
  IO,
  Socket
}

/**
 * Event listener
 *
 * @export
 * @interface Listener
 */
export interface Listener {
  event: string;
  type: EventType;
  method: string | symbol;
  middleware: Function[];
}

/**
 * Metadata class
 *
 * @export
 * @class Meta
 */
export class SocketMeta {
  /**
   * Namespace
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

  /**
   * Event listener params
   */
  params: Param[] = [];
}

/**
 * Socket IO Class
 *
 * @export
 * @interface SocketIOClass
 * @extends {Object}
 */
export interface SocketIOClass extends Object {
  __socket_meta__: SocketMeta;

  new (...deps: any[]);
}

/**
 * Injectable
 *
 * @export
 * @interface Injectable
 */
export interface Injectable {
  provide: SocketIOClass;
  deps: any[];
}

/**
 * Artifacts
 *
 * @export
 * @interface DecoratorsArtifacts
 */
export interface DecoratorsArtifacts {
  controller: SocketIOClass;
  meta: SocketMeta;
}
