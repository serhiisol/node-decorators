import * as socketIO from 'socket.io';
import { ParameterType } from './interface';

/**
 * Extract parameters for new handler
 * @param io
 * @param socket
 * @param params Meta parameters
 * @param eventArgs incoming arguments
 * @returns {Array} returns arguments array, or io and socket, event args (default) by default
 */
function extractParameters(io, socket, params, eventArgs): any[] {
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
 * Bootstrap and create io server
 * @param {number | string | Object} serverOrPort
 * @param {Object} options
 * @returns {SocketIOServer} server
 */
export function bootstrapSocketIO(serverOrPort: any, options?: any): SocketIOServer {

  let io: SocketIO.Server = socketIO.listen(serverOrPort, options);

  /**
   * Apply listeners to socket or io
   * @param socket
   * @param controller
   * @param {Listener} listeners object with registered listeners
   * @param {Params} params object with registered params for specific listener
   */
  function applyListeners(socket, controller, listeners: Listener, params: Params) {
    for (let listener in listeners) {
      if (listeners.hasOwnProperty(listener)) {
        let event: string = listeners[listener], handler: Function;

        handler = (...args) => {
          let handlerArgs = extractParameters(io, socket, params[listener], args);
          return controller[listener].apply(controller, handlerArgs)
        };

        (socket || io).on.apply((socket || io), [event, handler]);
      }
    }
  }

  /**
   * Attach Controller
   * @param Controller
   */
  function attachController(Controller) {

    const controller = new Controller(),
      meta: SocketIOMeta = controller.__meta__,
      listeners = meta.listeners,
      params = meta.params;

    /**
     * Apply all registered middleware to io
     */
    meta.middleware.forEach(middleware => {
      io.use(<any>middleware);
    });

    /**
     * Apply global listeners (io based)
     */
    applyListeners(null, controller, listeners.io, params);

    io.on('connection', socket => {
      /**
       * Apply socket listeners (socket based)
       */
      applyListeners(socket, controller, listeners.socket, params);
    });
  }

  return {
    /**
     * Function for adding new controllers
     * @param Controller
     * @returns { SocketIOServer }
     */
    attachController: function(Controller) {
      attachController(Controller);
      return this;
    },
    /**
     * Function for adding new controllers
     * @param Controllers
     * @returns { SocketIOServer }
     */
    attachControllers: function(Controllers = []) {
      Controllers.forEach(Controller => {
        attachController(Controller);
      });
      return this;
    },
    /**
     * IO Object
     * @type {SocketIO.Server}
     */
    io
  };

}
