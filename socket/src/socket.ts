import { ParameterType } from './interface';

/**
 * Extract parameters for new handler
 * @param io
 * @param socket
 * @param params Meta parameters
 * @param eventArgs incoming arguments
 * @returns {Array} returns arguments array, or io and socket, event args (default) by default
 */
function extractParameters(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  params,
  eventArgs
): any[] {
  let args = [];
  /**
   * if no parameters provided, return io and socket, and event arguments (which came for default handler)
   */
  if (!params || !params.length) {
    return [io, socket, ...eventArgs];
  }

  /**
   * Callback function
   * @type {Function}
   */
  let callback: Function;
  /**
   * extract callback function, it it exists
   */
  if (eventArgs.length && typeof eventArgs[eventArgs.length - 1] === 'function') {
    callback = eventArgs.pop();
  }

  /**
   * loop through all params and put them into correct order
   */
  for (let item of params) {
    switch(item.type) {
      case ParameterType.IO: args[item.index] = io; break;
      case ParameterType.Socket: args[item.index] = socket; break;
      case ParameterType.Args: args[item.index] = eventArgs.pop(); break;
      case ParameterType.Callback: args[item.index] = callback; break;
    }
  }

  return args;
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
  controller,
  listeners: Listener,
  params: Params
) {
  for (let listener of Object.keys(listeners)) {
    if (socket) {
      listeners[listener].middleware.forEach((middleware: Function) => {
        (<any>socket).use((packet, next) => {
          if (packet[0] === listeners[listener].event) {
            return middleware(io, socket, packet, next);
          }
          next();
        });
      });
    }

    (socket || io).on(listeners[listener].event, (...args) => {
      let handlerArgs = extractParameters(io, (socket || args[0]), params[listener], args);
      return controller[listener].apply(controller, handlerArgs)
    });
  }
}

/**
 * Get artifacts, instantiates controller and extract meta data
 * @param Controller
 * @returns { {controller, meta: SocketIOMeta, listeners: {io: Listener, socket: Listener}, params: Params} }
 */
function getArtifacts(Controller) {
  const controller = new Controller(),
    meta: SocketIOMeta = controller.__meta__,
    namespace: string = meta.namespace,
    listeners = meta.listeners,
    params = meta.params;
  return { controller, meta, listeners, params, namespace };
}

/**
 * Attach controller to socket
 * @param io
 * @param socket
 * @param artifacts
 */
function _attachControllerToSocket(io, socket, artifacts) {
  /**
   * Apply all registered middleware to socket
   */
  artifacts.meta.middleware.socket.forEach(middleware => {
    (<any>socket).use((...args) =>middleware.apply(middleware, [io, socket, ...args]));
  });

  /**
   * Apply all registered controller-based middleware to socket
   */
  artifacts.meta.middleware.controller.forEach(middleware => {
    (<any>socket).use((packet, next) => {
      if (artifacts.meta.listeners.all.indexOf(packet[0]) !== -1) {
        return middleware.apply(middleware, [io, socket, packet, next])
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
    artifacts.listeners.socket,
    artifacts.params
  );
}

/**
 * Attach Controller
 * @param io
 * @param Controller
 */
function attachController(io: SocketIO.Server, Controller) {
  const artifacts = getArtifacts(Controller),
    _io: SocketIO.Namespace = io.of(artifacts.namespace);

  /**
   * Apply all registered global middleware to io
   */
  artifacts.meta.middleware.io.forEach(middleware => {
    _io.use((...args) => middleware.apply(middleware, [_io, ...args]));
  });

  /**
   * Apply global listeners (io based)
   */
  applyListeners(_io, null, artifacts.controller, artifacts.listeners.io, artifacts.params);

  /**
   * Apply local listeners (socket based)
   */
  _io.on('connection', (socket) => _attachControllerToSocket(_io, socket, artifacts));
}

/**
 * Attaches controllers to IO server
 * @param {SocketIO.Server} io
 * @param {Object[]} Controllers
 */
export function bootstrapSocketIO(io: SocketIO.Server, Controllers: any[]) {
  Controllers.forEach(Controller => {
    attachController(io, Controller);
  });
}

/**
 * Attach Controller to already existed socket io server
 * With this approach you can't define global middleware, it's up to you.
 * @param {SocketIO.Server} io
 * @param {SocketIO.Socket} socket
 * @param Controllers
 */
export function attachControllerToSocket(
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  Controllers
) {
  Controllers.forEach(Controller => {
    _attachControllerToSocket(io, socket, getArtifacts(Controller));
  });
}
