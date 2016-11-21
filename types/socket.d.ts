interface Listener {
  [key: string]: string;
}

interface SocketIOMeta {
  serverOrPort: any;
  options: any;
  namespace: string;

  middleware: Function[];
  socketMiddleware: Function[];

  listeners: {
    io: Listener;
    socket: Listener;
  };

  params: Params;
}

interface SocketIOClass extends Object {
  __meta__: SocketIOMeta;
}
