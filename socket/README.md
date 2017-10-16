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
* **@Connect()** - alias of **@Connection()**
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
* **@IO(WrapperClass?: Class)** - returns server itself
* **@Socket(WrapperClass?: Class)** - returns socket

If **WrapperClass** provided, returns instance
of **WrapperClass**, passes **socket** or **server** as dependency into **WrapperClass**

```typescript
class SocketWrapper {
  constructor(private ioSock: SocketIO.Server|SocketIO.Namespace|SocketIO.Socket) {}
}
```

* **@Args()** - returns event arguments (excluding callback, if it exists)
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
* Global Server Middleware (**io.use(...)**)
* Global Socket middleware (**socket.use(...)**)
* Controller based middleware (**@Controller(...)**)
* Event based middleware (**@Event(...)**)

Additionally to this order depends on the order how you've registered appropriate types of middleware

### Quick Example:
```typescript
import { listen } from 'socket.io';
import { Event, Args, attachControllers, Controller } from '@decorators/socket';

const server = listen(3000);

@Controller('/')
class MessageController {

  @Event('message')
  onMessage(@Args() message) {
    console.log(
      `Message:  ${message}`
    );
  }

}

attachControllers(server, [ MessageController ]);
```

[Socket.IO]:http://socket.io/
