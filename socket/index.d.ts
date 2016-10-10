interface SocketIOServer {
  controller(controller);
}
export function bootstrapSocketIO(baseController): SocketIOServer;

export function Connect(serverOrPort, opts?);
export function Middleware(fn: Function);

export function OnIO(event: string);
export function OnConnect();
export function OnConnection();

export function OnSocket(event: string);

export function IO();
export function Socket();
export function Args();
export function Callback();
