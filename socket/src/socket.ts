import { Container } from '@decorators/di';

import {
  ParameterType,
  Param,
  EventType,
  Listener,
  SocketMeta,
  SocketClass,
  getMeta
} from './meta';
import { executeMiddleware, IO_MIDDLEWARE, middlewareHandler } from './middleware';

/**
 * Attaches controllers to IO server
 *
 * @param {SocketIO.Server} io
 * @param {SocketClass[]} controllers
 */
export function attachControllers(io: SocketIO.Server, controllers: SocketClass[]) {
  controllers.forEach((controller: SocketClass) => attachController(io, controller));
}

/**
 * Attach Controller
 *
 * @param {SocketIO.Server} IO
 * @param {SocketClass} Controller
 */
function attachController(
  io: SocketIO.Server,
  controller: SocketClass
) {
  const instance: SocketClass = Container.get(controller);
  const meta: SocketMeta = getMeta(instance);
  const ioNS: SocketIO.Namespace = io.of(meta.namespace);

  ioNS.use((socket, next) => middlewareHandler(IO_MIDDLEWARE)(ioNS, socket, next));

  /**
   * Apply io based events
   */
  applyEvents(io, null, controller, EventType.IO);

  /**
   * Apply local listeners (socket based)
   */
  ioNS.on('connection', (socket: SocketIO.Socket) => {
    /**
     * Apply all registered controller-based and event-based middlewares to socket
     */
    (socket as any).use(socketMiddlewareHandler(io, socket, meta));

    /**
     * Apply socket based events
     */
    applyEvents(io, socket, controller, EventType.Socket);
  });
}

/**
 * Handler for all registered controller based middleware
 *
 * @param {IO} io
 * @param {SocketIO.Socket} socket
 * @param {SocketMeta} meta
 */
function socketMiddlewareHandler(io: IO, socket: SocketIO.Socket, meta: SocketMeta) {
  return (packet, next) => {
    const [ event, data ]: string = packet;
    const args = [ io, socket, { event, data } ];
    /**
     * Find listener that serves this event
     */
    const listener = meta.listeners
      .find((lst: Listener) => lst.event === event);

    /**
     * And if listener exists, loop through controller middlewares
     * and after that event (registered in listener) middlewares
     */
    if (listener) {
      return executeMiddleware(meta.middleware, args)
        .then(() => executeMiddleware(listener.middleware, args))
        .then(() => next())
        .catch(err => next(err));
    }

    next();
  };
}

/**
 * Apply listeners to socket or io
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {DecoratorsArtifacts} artifacts
 * @param {EventType} type
 */
function applyEvents(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  controller: SocketClass,
  type: EventType
) {
  const instance: SocketClass = Container.get(controller);
  const meta: SocketMeta = getMeta(instance);
  const ioSock: any = socket || io;

  meta.listeners
    .filter((listener: Listener) => listener.type === type)
    .forEach((listener: Listener) => ioSock.on(listener.event, (...args) => {
      const methodName: string = listener.methodName;
      const newArgs: any[] = mapArguments(
        io, socket || args[0], meta.params[methodName], args
      );

      return controller[methodName].apply(controller, newArgs);
    }));
}

/**
 * Map parameters for new handler
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {Param[]} params Meta parameters
 * @param {any[]} args Event handler arguments
 * @returns {Array} returns arguments array, or io and socket, event args by default
 */
function mapArguments(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  params: Param[],
  args: any[]
): any[] {
  /**
   * if no parameters provided, return io and socket, and event arguments
   * (which came for default handler)
   */
  if (!params || !params.length) {
    return [io, socket, ...args];
  }

  /**
   * loop through all params and put them into correct order
   */
  return params
    .sort((param: Param) => param.index)
    .map((param: Param) => {
      switch (param.type) {
        case ParameterType.IO: return getWrapper(param, io);
        case ParameterType.Socket: return getWrapper(param, socket);
        case ParameterType.Args: return getArgs(args);
        case ParameterType.Ack: return getAck(args);
      }
    });
}

/**
 * Get ack callback function
 * @description extract callback function, it it exists
 *
 * @param {any[]} args Event arguments, passed to handler function
 */
function getAck(args: any[]) {
  const ackExists: boolean = typeof args[args.length - 1] === 'function';

  return ackExists ? args.pop() : noop;
}

/**
 * Get proper message data
 *
 * @param {any[]} args
 *
 * @returns {*}
 */
function getArgs(args: any[]): any {
  return typeof args[args.length - 1] === 'function' ?
    args[args.length - 2] : args[args.length - 1];
}

/**
 * Get original socket or io server, or create instance of passed WrapperClass (data)
 *
 * @param {Param} item
 * @param {object} obj
 *
 * @returns {*}
 */
function getWrapper(item: Param, obj: object): any {
  return item.wrapper ? new item.wrapper(obj) : obj;
}

/**
 * Dummy empty function, to ensure that callback exists
 */
function noop() {}

type IO = SocketIO.Server | SocketIO.Namespace;
