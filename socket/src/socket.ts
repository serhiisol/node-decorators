import {
  DEFAULT_NAMESPACE,
  MiddlewareType,
  Middleware,
  ParameterType,
  Param,
  EventType,
  Listener,
  SocketMeta,
  Injectable,
  SocketIOClass,
  DecoratorsArtifacts
} from './interface';
import { getMeta, noop, loopFns } from './utils';

/**
 * Attaches controllers to IO server
 *
 * @param {SocketIO.Server} io
 * @param {Array<Injectable|ExpressClass>} injectables
 */
export function attachControllers(
  io: SocketIO.Server,
  injectables: any[]
) {
  injectables.forEach((injectable: Injectable | SocketIOClass) => {
    const controller: SocketIOClass =
      (<Injectable>injectable).provide || <SocketIOClass>injectable;
    const deps: any[] = (<Injectable>injectable).deps || [];

    attachController(io, controller, deps);
  });
}

/**
 * Attach Controller to already existed socket io server
 * With this approach you can't define global middleware, it's up to you.
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {Array<Injectable|SocketIOClass>} injectables
 */
export function attachControllersToSocket(
  io: SocketIO.Server|SocketIO.Namespace,
  socket: SocketIO.Socket,
  injectables: any[]
) {
  injectables.forEach((injectable: Injectable | SocketIOClass) => {
    const Controller: SocketIOClass =
      (<Injectable>injectable).provide || <SocketIOClass>injectable;
    const deps: any[] = (<Injectable>injectable).deps || [];

    attachControllerToSocket(io, socket, getArtifacts(Controller, deps));
  });
}

/**
 * Attach Controller
 *
 * @param {SocketIO.Server} IO
 * @param {SocketIOClass} Controller
 * @param {any[]} deps
 */
function attachController(
  IO: SocketIO.Server,
  Controller: SocketIOClass,
  deps: any[]
) {
  const artifacts = getArtifacts(Controller, deps);
  const io: SocketIO.Namespace = IO.of(artifacts.meta.ns || DEFAULT_NAMESPACE);
  const controller: SocketIOClass = artifacts.controller;

  /**
   * Filter all registered middleware and find IO middleware
   * Construct flat array of functions
   * Apply all middleware functions to io
   */
  findMiddleware(artifacts, MiddlewareType.IO)
    .forEach((fn: Function) =>
      io.use((...args) => fn.call(controller, io, ...args))
    );

  /**
   * Apply io based events
   */
  applyEvents(io, null, artifacts, EventType.IO);

  /**
   * Apply local listeners (socket based)
   */
  io.on('connection', (socket: SocketIO.Socket) => {
    attachControllerToSocket(io, socket, artifacts);
  });
}

/**
 * Attach controller to socket
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {DecoratorsArtifacts} artifacts
 */
function attachControllerToSocket(
  io: SocketIO.Server|SocketIO.Namespace,
  socket: SocketIO.Socket,
  artifacts: DecoratorsArtifacts
) {
  const controller: SocketIOClass = artifacts.controller;

  /**
   * Apply all registered global socket based middleware (@Middleware)
   */
  findMiddleware(artifacts, MiddlewareType.Socket)
    .forEach((fn: Function) => {
      (<any>socket).use((...args) => fn.call(controller, io, socket, ...args));
    });

  /**
   * Apply all registered controller-based and event-based middlewares to socket
   */
  (<any>socket).use(socketMiddlewareHandler(io, socket, artifacts));

  /**
   * Apply socket based events
   */
  applyEvents(io, socket, artifacts, EventType.Socket);
}

/**
 * Handler for all registered controller based middleware
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {DecoratorsArtifacts} artifacts
 * @returns {(packet, next) => void}
 */
function socketMiddlewareHandler(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  artifacts: DecoratorsArtifacts
): (packet, next) => void {
  const socketMds = findMiddleware(artifacts, MiddlewareType.Controller);

  return (packet, next) => {
    const [event]: [string] = packet;
    const args = [io, socket, packet];
    /**
     * Find listener that serves this event
     */
    const listener = artifacts.meta.listeners
      .find((lst: Listener) => lst.event === event);

    /**
     * And if listener exists, loop through controller middlewares
     * and after that event (registered in listener) middlewares
     */
    if (listener) {
      return loopFns(socketMds, args)
        .then(() => loopFns(listener.middleware, args))
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
  artifacts: DecoratorsArtifacts,
  type: EventType
) {
  const ioSock: any = socket || io;

  artifacts.meta.listeners
    .filter((listener: Listener) => listener.type === type)
    .forEach((listener: Listener) => {
      ioSock.on(listener.event, makeEventListener(io, socket, artifacts, listener.method));
    });
}

/**
 * Makes new event listeners
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} Socket
 * @param {DecoratorsArtifacts} artifacts
 * @param {string|symbol} method Handler name
 *
 * @returns {Function} Returns new handler, which serves event, extracts
 * proper arguments and executes original function
 */
function makeEventListener(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  artifacts: DecoratorsArtifacts,
  method: string | symbol
): Function {
  const params: Param[] = artifacts.meta.params
    .filter((param: Param) => param.method === method);
  const controller: SocketIOClass = artifacts.controller;

  return function(...args) {
    const newArgs: any[] = mapArguments(io, socket, params, args);

    return controller[method].apply(controller, newArgs);
  };
}

/**
 * Get ack callback function
 *
 * @description extract callback function, it it exists
 * @param {any[]} args Event arguments, passed to handler function
 */
function getAck(args: any[]) {
  const ackExists: boolean = typeof args[args.length - 1] === 'function';

  return ackExists ? args.pop() : noop;
}

/**
 * Get original socket, or create instance of passed WrapperClass (data)
 *
 * @param {ParameterConfiguration} item
 * @param {SocketIO.Socket} socket
 * @returns {SocketIO.Socket}
 */
function getSocket(item: Param, socket: SocketIO.Socket) {
  return item.data ? new item.data(socket) : socket;
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

  const ack: Function = getAck(args);

  /**
   * loop through all params and put them into correct order
   */
  return params
    .sort((param: Param) => param.index)
    .map((param: Param) => {
      switch (param.type) {
        case ParameterType.IO: return io;
        case ParameterType.Socket: return getSocket(param, socket);
        case ParameterType.Args: return args.pop(); // TODO: check args, not sure that it works correctly
        default: return ack;
      }
    });
}

/**
 * Iteratee through middleware and find proper ones
 *
 * @param {Middleware[]} middleware
 * @param {MiddlewareType} type
 * @returns {Function[]}
 */
function findMiddleware(
  artifacts: DecoratorsArtifacts,
  type: MiddlewareType
): Function[] {
  return artifacts.meta.middleware
    .filter((md: Middleware) => md.type === type)
    .reduce((acc: Function[], md: Middleware) =>
      [...acc, ...md.middleware], []
    );
}

/**
 * Get artifacts, instantiates controller and extract meta data
 *
 * @param {SocketIOClass} Controller
 * @param {any[]} deps
 * @returns {DecoratorsArtifacts}
 */
function getArtifacts(Controller: SocketIOClass, deps: any[]): DecoratorsArtifacts {
  const controller = new Controller(...deps);
  const meta: SocketMeta = getMeta(controller);

  return { controller, meta };
}
