interface Listener {
  [key: string]: {
    event: string;
    middleware: Function[];
  };
}

interface SocketIOMeta {
  serverOrPort: any;
  options: any;
  namespace: string;

  middleware: {
    io: Function[];
    socket: Function[];
    controller: Function[];
  }

  listeners: {
    all: string[],
    io: Listener;
    socket: Listener;
  };

  params: Params;
}

interface SocketIOClass extends Object {
  __meta__: SocketIOMeta;
}
