/**
 * Parameter types enum
 */
export enum ParameterType {
  IO,
  Socket,
  Args,
  Callback
}

export interface Listener {
  [key: string]: {
    event: string;
    middleware: Function[];
  };
}

export interface SocketIOMeta {
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

export interface Injectable {
  provide: Function;
  deps: any[];
}
export interface SocketIOClass extends Object {
  __meta__: SocketIOMeta;

  new (...deps: any[]);
}
