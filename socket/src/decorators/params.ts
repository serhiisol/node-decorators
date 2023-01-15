import { ParameterType, getMeta } from '../meta';

/**
 * Parameter decorator factory, creates parameter decorator
 */
function makeDecorator(type: ParameterType) {
  return (wrapper?: any): ParameterDecorator => {
    return (target: object, methodName: string, index: number) => {
      const meta = getMeta(target);

      if (meta.params[methodName] === undefined) {
        meta.params[methodName] = [];
      }

      meta.params[methodName].push({ type, index, wrapper });
    };
  };
}

/**
 * Returns server itself
 */
export const IO = makeDecorator(ParameterType.IO);

/**
 * Returns socket
 */
export const Socket = makeDecorator(ParameterType.Socket);

/**
 * Returns event arguments (excluding callback)(if it exists)
 */
export const Args = makeDecorator(ParameterType.Args);

/**
 * Returns ack callback function (if it exists)
 */
export const Ack = makeDecorator(ParameterType.Ack);
