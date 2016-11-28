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
