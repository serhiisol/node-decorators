import { getMeta } from '../meta';

export let Connect = (serverOrPort: any, options?: any): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.serverOrPort = serverOrPort;
    meta.options = options;
  }
};

export let Middleware = (fn: Function): ClassDecorator  => {
  return (target: Function): void => {
    let meta: SocketIOMeta = getMeta(target.prototype);
    meta.middleware.push(fn);
  }
};
