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
  io: SocketIO.Server,
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
  io: SocketIO.Server,
  socket: SocketIO.Socket,
  controller,
  listeners: Listener,
  params: Params
) {
  for (let listener of Object.keys(listeners)) {
    (socket || io).on(listeners[listener], (...args) => {
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
   * Apply all registered middleware to io
   */
  artifacts.meta.socketMiddleware.forEach(middleware => {
    (<any>socket).use(middleware);
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
  const artifacts = getArtifacts(Controller);

  /**
   * Apply all registered global middleware to io
   */
  artifacts.meta.middleware.forEach(middleware => {
    io.use(<any>middleware);
  });

  /**
   * Apply global listeners (io based)
   */
  applyListeners(io, null, artifacts.controller, artifacts.listeners.io, artifacts.params);

  /**
   * Apply local listeners (socket based)
   */
  io
    .of(artifacts.namespace)
    .on('connection', (socket) => _attachControllerToSocket(io, socket, artifacts));
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
