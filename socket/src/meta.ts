import { Type } from './middleware';

/**
 * Parameter types enum
 *
 * @export
 * @enum {number}
 */
export enum ParameterType { IO, Socket, Args, Ack }

/**
 * Registered params
 *
 * @export
 * @interface Param
 */
export interface Param {
  type: ParameterType;
  index: number;
  wrapper?: any;
}

/**
 * Event types
 *
 * @export
 * @enum {number}
 */
export enum EventType { IO, Socket }

/**
 * Event listener
 *
 * @export
 * @interface Listener
 */
export interface Listener {
  methodName: string;
  event: string;
  type: EventType;
  middleware: Type[];
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
  namespace: string;

  /**
   * Middleware
   */
  middleware: Type[] = [];

  /**
   * Event listeners
   */
  listeners: Listener[] = [];

  /**
   * Event listener params
   */
  params: { [key: string]: Param[] } = {};
}

/**
 * Socket IO Class
 *
 * @export
 * @interface SocketIOClass
 * @extends {Object}
 */
export interface SocketClass extends Object {
  __socket_meta__?: SocketMeta;
}

/**
 * Get or initiate metadata on target
 *
 * @param target
 *
 * @returns {SocketIOMeta}
 */
export function getMeta(target: SocketClass): SocketMeta {
  if (!target.__socket_meta__) {
    target.__socket_meta__ = new SocketMeta();
  }

  return target.__socket_meta__;
}
