/**
 * Class Decorators
 */
function Connect(serverPort) {}
function IOMiddleware(fn: Function) {}
function Middleware(fn: Function) {}

/**
 * Function decorators
 */
function ListenIO(event: string) {}
function OnConnection() {}
let OnConnect = OnConnection;

function OnDisconnect() {}
function OnSocket(event: string) {}
function OnIO(event: string) {}

/**
 * Param decorators
 */
function IO() {}
function Socket() {}
function Args(name?) {}
function Callback() {}



function bootstrapSocketIO(baseController) {
  return { controller: function(controller) { } };
}

@Connect('8080')
@Middleware(() => {})
class ConnectClass {

  constructor() {}

  @OnConnection
  @Middleware(() => {})
  onConnection(@Socket() socket, @IO() io) {

  }

  @OnDisconnect
  onDisconnect() {}

  @OnSocket('message')
  onMessage() {}

}

class AnotherController {}

let server = bootstrapSocketIO(ConnectClass);
server.controller(AnotherController);
