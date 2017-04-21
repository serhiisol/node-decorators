import { Meta, SocketIOClass } from './interface';

/**
 * Get or initiate metadata on target
 * @param target
 * @returns {SocketIOMeta}
 */
export function getMeta(target: SocketIOClass): Meta {
  if (!target.__socket_meta__) {
    target.__socket_meta__ = new Meta();
  }

  return target.__socket_meta__;
}
