import {
  ParameterType,
  Listener,
  Meta,
  Injectable,
  SocketIOClass,
  Param,
  DecoratorsArtifacts,
  DEFAULT_NAMESPACE,
  MiddlewareType,
  Middleware
} from './interface';
import { getMeta } from './meta';

/**
 * Dummy function to ensure, that callback exists
 */
function noop() {}

/**
 * Get original socket, or create instance of passed WrapperClass (data)
 * @param {ParameterConfiguration} item
 * @param {SocketIO.Socket} socket
 * @returns {SocketIO.Socket}
 */
function getSocket(item: Param, socket: SocketIO.Socket) {
  return item.data ? new item.data(socket) : socket;
}

/**
 * Extract parameters for new handler
 * @param io
 * @param socket
 * @param params Meta parameters
 * @param eventArgs incoming arguments
 * @returns {Array} returns arguments array, or io and socket, event args by default
 */
function extractArguments(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  params: Param[],
  eventArgs
): any[] {
  /**
   * Final arguments
   */
  const args: any[] = [];
  /**
   * if no parameters provided, return io and socket, and event arguments (which came for default handler)
   */
  if (!params || !params.length) {
    return [io, socket, ...eventArgs];
  }

  /**
   * Callback function
   * @description extract callback function, it it exists
   * @type {Function}
   */
  const callback: Function =
    eventArgs.length && typeof eventArgs[eventArgs.length - 1] === 'function' ?
    eventArgs.pop() : noop;

  /**
   * loop through all params and put them into correct order
   */
  for (let item of params) {
    switch (item.type) {
      case ParameterType.IO: args[item.index] = io; break;
      case ParameterType.Socket: args[item.index] = getSocket(item, socket); break;
      case ParameterType.Args: args[item.index] = eventArgs.pop(); break;
      default: args[item.index] = callback; break;
    }
  }

  return args;
}



function makeEventListener(
  controller,
  listener,
  io,
  socket,
  params
) {
  return (...args) => {
    let handlerArgs = extractArguments(io, (socket || args.pop()), params[listener], args);

    return controller[listener].apply(controller, handlerArgs);
  };
}

/**
 * Apply listeners to socket or io
 * @param io
 * @param socket
 * @param controller
 * @param {Listener} listeners object with registered listeners
 * @param {Params} params object with registered params for specific listener
 */
function applyListeners(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  controller: SocketIOClass,
  listeners: Listener[],
  params: Param[]
) {
  for (const listener of Object.keys(listeners)) {

    let actual = listeners[listener];

    if (socket) {
      actual.middleware.forEach((middleware: Function) => {
        (<any>socket).use((packet, next) => {
          if (packet[0] === listeners[listener].event) {
            return middleware(io, socket, packet, next);
          }
          next();
        });
      });
    }

    (socket || io).on(actual.event, makeEventListener(controller, listener, io, socket, params));
  }
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
  artifacts.meta.middleware.socket.forEach(middleware => {
    (<any>socket).use((...args) => middleware.apply(middleware, [io, socket, ...args]));
  });
  artifacts.meta.middleware
    .filter((md: Middleware) => md.type === MiddlewareType.Socket)
    .reduce((acc: Function[], md: Middleware) => {
      return acc.concat(md.middleware);
    }, [])
    .forEach((fn: Function) => {
      io.use((...args) => fn.apply(fn, [io, ...args]));
    });

  /**
   * Apply all registered controller-based middleware to socket
   */
  artifacts.meta.middleware.controller.forEach(middleware => {
    (<any>socket).use((packet, next) => {
      if (artifacts.meta.listeners.all.indexOf(packet[0]) !== -1) {
        return middleware.apply(middleware, [io, socket, packet, next]);
      }
      next();
    });
  });

  /**
   * Apply socket listeners (socket based)
   */
  applyListeners(
    io,
    socket,
    artifacts.controller,
    artifacts.meta.listeners,
    artifacts.meta.params
  );
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
  const socket: SocketIO.Socket = null;

  /**
   * Filter all registered middleware and find IO middleware
   * Construct flat array of functions
   * Apply all middleware functions to io
   */
  artifacts.meta.middleware
    .filter((md: Middleware) => md.type === MiddlewareType.IO)
    .reduce((acc: Function[], md: Middleware) => {
      return acc.concat(md.middleware);
    }, [])
    .forEach((fn: Function) => {
      io.use((...args) => fn.apply(fn, [io, ...args]));
    });

  /**
   * Apply global listeners (io based)
   */
  applyListeners(
    io,
    socket,
    artifacts.controller,
    artifacts.meta.listeners, artifacts.meta.params);

  /**
   * Apply local listeners (socket based)
   */
  io.on('connection', (socket: SocketIO.Socket) => {
    attachControllerToSocket(io, socket, artifacts);
  });
}

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
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param {Array<Injectable|ExpressClass>} injectables
 */
export function attachControllersToSocket(
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  injectables: any[]
) {
  injectables.forEach((injectable: Injectable | SocketIOClass) => {
    const controller: SocketIOClass =
      (<Injectable>injectable).provide || <SocketIOClass>injectable;
    const deps: any[] = (<Injectable>injectable).deps || [];

    attachControllerToSocket(io, socket, getArtifacts(controller, deps));
  });
}
