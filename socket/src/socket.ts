import * as socketIO from 'socket.io';
import { ParameterType } from './interface';

function extractParameters(io, socket, params, eventArgs) {
  let args = [];
  if (!params || !params.length) {
    return [io, socket];
  }
  let callback: Function, argsAdded = false;
  if (eventArgs.length && typeof eventArgs[eventArgs.length - 1] === 'function') {
    callback = eventArgs.pop();
  }

  for (let item of params) {

    switch(item.type) {
      case ParameterType.IO: args[item.index] = io; break;
      case ParameterType.Socket: args[item.index] = socket; break;
      case ParameterType.Args:
        args[item.index] = eventArgs.pop();
        argsAdded = true;
        break;
      case ParameterType.Callback: args[item.index] = callback; break;
    }

  }

  if (!argsAdded) {
    args = args.concat(eventArgs);
  }

  return args;
}

export function bootstrapSocketIO(BaseController): SocketIOServer {

  let io;

  function applyListeners(socket, controller, listeners, params) {
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

  function attachController(Controller, allowConnect) {

    const controller = new Controller(),
      meta: SocketIOMeta = controller.__meta__,
      listeners = meta.listeners,
      params = meta.params;

    if (allowConnect) {
      io = socketIO.listen.apply(socketIO, [meta.serverOrPort, meta.options]);
    }

    if (!io) {
      throw new Error('Register at least one controller with @Connect');
    }

    meta.middleware.forEach(middleware => {
      io.use(middleware);
    });

    applyListeners(null, controller, listeners.io, params);

    io.on('connection', socket => {
      applyListeners(socket, controller, listeners.socket, params);
    });
  }

  attachController(BaseController, true);
  return {
    controller: (Controller) => attachController(Controller, false)
  };
}
