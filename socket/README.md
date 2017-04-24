![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for [Socket.IO]

### Installation
```
npm install @decorators/socket --save
```
### API

#### Decorators
##### Class
* **@Controller(namespace?: string, middleware?: Function | Function[])** - registers controller for controller

* **@ServerMiddleware(middleware: Function | Function[])** - registers global server (io) middleware
```typescript
function middleware(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  next: Function
) {}
```

* **@Middleware(middleware: Function | Function[]) => {})** - registers socket global middleware
```typescript
function middleware(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  packet: [string, any],
  next: Function
) {}
```

##### Method
* **@Connection()** - register **connection** listener (**io.on('connection', fn)**)
* **@Disconnect()** - register disconnect socket event (**socket.on('disconnect', fn)**)
* **@GlobalEvent(event: string)** - register global event (**io.on**)

* **@Event(event: string, middleware?: Function | Function[])** - register socket event (**socket.on**),
where middleware is a function which accepts four parameters:
```typescript
function middleware(
  io: SocketIO.Server | SocketIO.Namespace,
  socket: SocketIO.Socket,
  packet: [string, any],
  next: Function
) {}
```

##### Parameter
* **@IO()** - returns server itself
* **@Socket(WrapperClass?: Class)** - returns socket, if **WrapperClass** provided, returns instance
of **WrapperClass**, passes **socket** as dependency into **WrapperClass**
```typescript
class SocketWrapper {
  constructor(private socket: SocketIO.Socket) {}
}
```
* **@Args()** - returns event arguments (excluding callback)(if it exists)
* **@Ack()** - returns ack callback function (if it exists)

#### Helper Functions
* **attachControllers(io: SocketIO.Server, Controller[] || Injectable[])** -  Attaches controllers to IO server
* **attachControllersToSocket(io: SocketIO.Server, socket: SocketIO.Socket, Controller[] || Injectable[])** -  Attaches controllers to Socket
where Injectable:
```typescript
{ provide: UserController, deps: [UserService] }
```

### Details
#### Middleware
The middleware order :
* Global Server Middleware
* Global Socket middleware
* Controller based middleware
* Event based middleware
Additionally to this order depends on the order how you've registered appropriate types of middleware

### Quick Example:
```typescript
import { listen } from 'socket.io';
import { Event, Args, attachControllers, Controller } from '@decorators/socket';

const server = listen(3000);

@Controller('/messaging')
class MessageController {
  @Event('message')
  onMessage(@Args() message) {
    console.log(`Message:  ${message}`);
  }
}

attachControllers(server, [ MessageController ]);
```

[Socket.IO]:http://socket.io/
