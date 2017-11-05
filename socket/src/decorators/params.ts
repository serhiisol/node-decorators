import { SocketMeta, ParameterType, SocketClass, getMeta } from '../meta';

/**
 * Parameter decorator factory, creates parameter decorator
 *
 * @param {ParameterType} type
 */
function makeDecorator(type: ParameterType) {
  return (wrapper?: any): ParameterDecorator => {
    return (target: SocketClass, methodName: string, index: number) => {
      const meta: SocketMeta = getMeta(target);

      if (meta.params[methodName] === undefined) {
        meta.params[methodName] = [];
      }

      meta.params[methodName].push({ type, index, wrapper });
    };
  };
}

/**
 * Returns server itself
 *
 * @type {SocketIO.Server}
 */
export const IO = makeDecorator(ParameterType.IO);

/**
 * Returns socket
 *
 * @type {SocketIO.Socket}
 */
export const Socket = makeDecorator(ParameterType.Socket);

/**
 * Returns event arguments (excluding callback)(if it exists)
 *
 * @type {any[]}
 */
export const Args = makeDecorator(ParameterType.Args);

/**
 * Returns ack callback function (if it exists)
 *
 * @type {Function}
 */
export const Ack = makeDecorator(ParameterType.Ack);
