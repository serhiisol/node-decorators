# Socket#2.0.0
* Renamed **GlobalMiddleware** for socket global middleware into **Middleware**
* Renamed **Namespace** to **@Controller(namespace: string, middleware?: Function | Function[])**
* Removed **@Middleware(middleware: Function | Function[])** - use Controller based middleware
* Removed deprecated methods
  * **bootstrapSocketIO(io: SocketIO.Server, Controllers)** -  Attaches controllers to IO server - use **attachControllers** instead
  * **attachControllerToSocket(io: SocketIO.Server, socket: SocketIO.Socket, Controllers)** -  Attaches controllers to Socket - use **attachControllersToSocket** instead

# Socket#1.4.0
* Controller DI
```typescript
{ provide: UserController, deps: [UserService] }
```
* Renamed methods **bootstrapSocketIO** and **attachControllerToSocket** (see README for details)

# Socket#1.3.3
* Added possibility to pass array of middleware funcs into:
   * **@ServerMiddleware**
   * **@GlobalMiddleware**
   * **@Middleware**

# Socket#1.3.2
* Added wrap option for **@Socket(WrapperClass?)** decorator, now you can pass wrapper class in it, to get extended functionality over the socket, optional parameter, e.g.:
```typescript
class SocketWrapper {
  constructor(private socket: SocketIO.Socket) {}
}
```

# Socket#1.3.1
* Added callback function (noop) even if it doesn't exists, just prevent additional checks in controller

# Socket#1.3.0
* Renamed middleware names to
   * **@ServerMiddleware**
   * **@GlobalMiddleware**
   * **@Middleware**
* Renamed decorators:
   * **@Namespace**
   * **@GlobalEvent**
   * **@Connection**
   * **@Disconnect**
   * **@Event**
* Added event-based middleware, for socket events

# Socket#1.2.2
* Automatic definitions generation

# Socket#1.2.1
* added new parameters to middleware functions:
  * **@Middleware((io: SocketIO.Server | SocketIO.Namespace, socket: SocketIO.Socket, next: Function) => {})** - registers global (io) middleware
  * **@SocketMiddleware((io: SocketIO.Server | SocketIO.Namespace, socket: SocketIO.Socket, packet, next: Function) => {})** - registers socket middleware

# Socket#1.2.0
* Updated Socket.io version to **1.6.0**
* Removed **attachController** for the sake of **attachControllers**
* **bootstrapSocketIO** now accepts io server instance as first argument and array of controllers as second
* New **@Controller(namespace: string)** decorator, registers namespace for sockets
* **attachControllerToSocket(io: SocketIO.Server, socket: SocketIO.Socket, Controllers)** -  Attaches controllers to Socket

# Socket#1.1.2
* Moved server configuration out of **@Connect** decorator to **bootstrapSocketIO**
  ```
  bootstrapSocketIO(httpServerInstance || 3000)
  ```
* Removed  **@Connect** decorator
* **attachControllers** attach array of controllers

# Socket#1.1.1
* new socket.io decorator
  ##### Method
    * **@OnDisconnect()**
* **SocketIOServer** interface added
  * **attachController** will now return correct object (SocketIOServer, this)

# Socket#1.1.0
* New socket.io decorators
  #### Functions
  * **bootstrapSocketIO(rootController: Controller)**
  ##### Class
  * **@Connect(serverOrPort: number | string | HttpServer, opts?: any)**
  * **@Middleware(fn: Function)**
  ##### Method
  * **@OnIO(event: string)**
  * **@OnConnect()**
  * **@OnConnection()**
  * **@OnSocket(event: string)**
  ##### Parameter
  * **@IO()**
  * **@Socket()**
  * **@Args()**
  * **@Callback()**
