import { getMeta } from '../meta';

function makeListenerMeta(target: SocketIOClass, key: string | symbol, descriptor: any, type: string, event: string) {
  let meta: SocketIOMeta = getMeta(target);
  meta.listeners[type][key] = event;
  return descriptor;
}

let makeListener = (type: string, event: string): MethodDecorator => {
  return (target: SocketIOClass, key: string | symbol, descriptor: any) => {
    return makeListenerMeta(target, key, descriptor, type, event)
  };
}


export let OnIO = (event: string): MethodDecorator => makeListener('io', event);
export let OnConnect = (): MethodDecorator => makeListener('io', 'connection');
export let OnConnection = OnConnect;

export let OnSocket = (event: string): MethodDecorator => makeListener('socket', event);
