export {
  Namespace,
  ServerMiddleware,
  GlobalMiddleware,
  Middleware,
  Connection,
  Disconnect,
  GlobalEvent,
  Event,
  IO,
  Socket,
  Args,
  Callback
} from './decorators';
export { attachControllers, attachControllersToSocket } from './socket';

/** @deprecated */
export { bootstrapSocketIO, attachControllerToSocket } from './socket';
