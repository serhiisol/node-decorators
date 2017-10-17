import { SocketMeta, ParameterType, SocketIOClass } from '../interface';
import { getMeta } from '../utils';

/**
 * Add parameter to metadata
 *
 * @param {SocketIOClass} target Target Class
 * @param {string|symbol} key Function name, parameters owner
 * @param {ParameterType} type
 * @param {number} index
 * @param {*} [data]
 */
function addParameter(
  target: SocketIOClass,
  method: string | symbol,
  type: ParameterType,
  index: number,
  data?: any
): void {
  const meta: SocketMeta = getMeta(target);

  meta.params.push({ type, method, index, data });
}

/**
 * Parameter decorator factory, creates parameter decorator
 *
 * @param parameterType Parameter Type
 *
 * @returns { (WrapperClass?: any) => ParameterDecorator }
 */
function makeDecorator(parameterType: ParameterType): (WrapperClass?: any) => ParameterDecorator {
  return (WrapperClass?: any): ParameterDecorator => {
    return (target: SocketIOClass, key: string | symbol, index: number) => {
      addParameter(target, key, parameterType, index, WrapperClass);
    };
  };
}

/**
 * Returns server itself
 *
 * @type { () => ParameterDecorator }
 */
export const IO = makeDecorator(ParameterType.IO);

/**
 * Returns socket
 *
 * @param WrapperClass Class, that will get plain socket object as dependency to add new functionality on top of standard one
 * @type {(WrapperClass?: any) => ParameterDecorator}
 */
export const Socket = makeDecorator(ParameterType.Socket);

/**
 * Returns event arguments (excluding callback)(if it exists)
 *
 * @type {() => ParameterDecorator}
 */
export const Args = makeDecorator(ParameterType.Args);

/**
 * Returns ack callback function (if it exists)
 *
 * @type {() => ParameterDecorator}
 */
export const Ack = makeDecorator(ParameterType.Ack);
