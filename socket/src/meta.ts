/**
 * Get or initiate metadata on target
 * @param target
 * @returns {SocketIOMeta}
 */
export function getMeta(target: SocketIOClass): SocketIOMeta {
  if (!target.__meta__) {
    target.__meta__ = <SocketIOMeta> {
      serverOrPort: undefined,
      options: undefined,
      namespace: '/',
      middleware: [],
      socketMiddleware: [],
      listeners: {
        io: {},
        socket: {}
      },
      params: {}
    };
  }

  return <SocketIOMeta>target.__meta__;
}


