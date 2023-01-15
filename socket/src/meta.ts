import { Middleware } from './middleware';

/**
 * Parameter types enum
 */
export enum ParameterType { IO, Socket, Args, Ack }

/**
 * Registered params
 */
export interface Param {
  type: ParameterType;
  index: number;
  wrapper?: any;
}

/**
 * Event types
 */
export enum EventType { IO, Socket }

/**
 * Event listener
 */
export interface Listener {
  methodName: string;
  event: string;
  type: EventType;
  middleware: Middleware[];
}

/**
 * Metadata class
 */
export class SocketMeta {
  /**
   * Namespace
   */
  namespace: string;

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
  params: { [key: string]: Param[] } = {};
}

/**
 * Socket IO Class
 */
export interface SocketClass extends Object {
  __socket_meta__?: SocketMeta;
}

/**
 * Get or initiate metadata on target
 */
export function getMeta(target: SocketClass): SocketMeta {
  if (!target.__socket_meta__) {
    target.__socket_meta__ = new SocketMeta();
  }

  return target.__socket_meta__;
}
