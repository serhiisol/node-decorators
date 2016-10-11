interface Listener {
  [key: string]: string;
}

interface SocketIOMeta {
  serverOrPort: any;
  options: any;

  middleware: Function[];

  listeners: {
    io: Listener;
    socket: Listener;
  };

  params: Params;
}

interface SocketIOClass extends Object {
  __meta__: SocketIOMeta;
}

interface SocketIOServer {
  attachController(controller);
  io: SocketIO.Server
}
