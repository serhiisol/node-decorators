import {
  DEFAULT_NAMESPACE,
  MiddlewareType,
  Middleware,
  ParameterType,
  Param,
  EventType,
  Listener,
  Meta,
  Injectable,
  SocketIOClass,
  DecoratorsArtifacts
} from './interface';
import { getMeta } from './meta';
import { noop } from './utils';

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
 * Extract parameters for new handler
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {Param[]} params Meta parameters
 * @param {any[]} args Event handler arguments
 * @returns {Array} returns arguments array, or io and socket, event args by default
 */
function extractArguments(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  params: Param[],
  args: any[]
): any[] {
  const ack: Function = getAck(args);

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
        case ParameterType.IO: return io;
        case ParameterType.Socket: return getSocket(param, socket);
        case ParameterType.Args: return args.pop(); // TODO: check args, not sure that it works correctly
        default: return ack;
      }
    });
}

/**
 * Makes new event listeners
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} Socket
 * @param {SocketIOClass} controller
 * @param {string|symbol} method Handler name
 * @param {Param[]} params
 *
 * @returns {Function} Returns new handler, which serves event, extracts
 * proper arguments and executes original function
 */
function makeEventListener(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  controller: SocketIOClass,
  method: string | symbol,
  params: Param[]
): Function {
  return function(...args) {
    const newArgs: any[] = extractArguments(io, socket, params, args);

    return controller[method].apply(controller, newArgs);
  };
}

/**
 * Iteratee through middleware and find proper ones
 *
 * @param {Middleware[]} middleware
 * @param {MiddlewareType} type
 * @returns {Function[]}
 */
function eachMiddleware(
  artifacts: DecoratorsArtifacts,
  type: MiddlewareType
): Function[] {
  return artifacts.meta.middleware
    .filter((md: Middleware) => md.type === type)
    .reduce((acc: Function[], md: Middleware) => [...acc, ...md.middleware], []);
}

/**
 * Apply listeners to socket or io
 *
 * @param {SocketIO.Server|SocketIO.Namespace} io
 * @param {SocketIO.Socket} socket
 * @param {DecoratorsArtifacts} artifacts
 * @param {EventType} type
 */
function applyListeners(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  artifacts: DecoratorsArtifacts,
  type: EventType
) {
  artifacts.meta.listeners
    .filter((listener: Listener) => listener.type === type)
    .forEach((listener: Listener) => {
      listener.middleware
        .forEach((md: Function) => {
          (<any>socket).use((packet, next) => {
            const [event] = packet;

            if (listener.event === event) {
              return md(io, socket, packet, next);
            }

            next();
          });
        });

      const params: Param[] = artifacts.meta.params
        .filter((param: Param) => param.method === listener.method);

      (<any>socket || io)
        .on(listener.event, makeEventListener(io, socket, artifacts.controller, listener.method, params));
    });
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
  const meta: Meta = getMeta(controller);

  return { controller, meta };
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
  /**
   * Apply all registered middleware to socket
   */
  eachMiddleware(artifacts, MiddlewareType.Socket)
    .forEach((fn: Function) => {
      (<any>socket).use((...args) => fn.call(fn, io, socket, ...args));
    });

  /**
   * Apply all registered controller-based middleware to socket
   */
  eachMiddleware(artifacts, MiddlewareType.Controller)
    .forEach((fn: Function) => {
      (<any>socket).use((packet, next) => {
        const [event] = packet;
        const listener = artifacts.meta.listeners.find(ls => ls.event === event);

        if (listener) {
          return fn.call(fn, io, socket, packet, next);
        }

        next();
      });
    });

  /**
   * Apply socket listeners (socket based)
   */
  applyListeners(io, socket, artifacts, EventType.Socket);
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

  /**
   * Filter all registered middleware and find IO middleware
   * Construct flat array of functions
   * Apply all middleware functions to io
   */
  eachMiddleware(artifacts, MiddlewareType.IO)
    .forEach((fn: Function) => {
      io.use((...args) => fn.call(fn, io, ...args));
    });

  /**
   * Apply global listeners (io based)
   */
  applyListeners(io, null, artifacts, EventType.IO);

  /**
   * Apply local listeners (socket based)
   */
  io.on('connection', (socket: SocketIO.Socket) => {
    attachControllerToSocket(io, socket, artifacts);
  });
}
