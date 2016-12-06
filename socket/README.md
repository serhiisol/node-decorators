![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [Socket.IO]

### Installation
```
npm install @decorators/socket --save
```
### API
#### Functions
* **bootstrapSocketIO(io: SocketIO.Server, Controllers)** -  Attaches controllers to IO server
* **attachControllerToSocket(io: SocketIO.Server, socket: SocketIO.Socket, Controllers)** -  Attaches controllers to Socket
 
#### Decorators
##### Class
* **@Namespace(namespace: string)** - registers controller for namespace
* **@ServerMiddleware((io: SocketIO.Server | SocketIO.Namespace, socket: SocketIO.Socket, next: Function) => {})** - registers global server (io) middleware
* **@GlobalMiddleware((io: SocketIO.Server | SocketIO.Namespace, socket: SocketIO.Socket, packet, next: Function) => {})** - registers socket global middleware
* **@Middleware((io: SocketIO.Server | SocketIO.Namespace, socket: SocketIO.Socket, packet, next: Function) => {})** - registers controller-based middleware, 
will handle only socket events registered in controller

##### Method
* **@GlobalEvent(event: string)** - register global event (**io.on**)
* **@Connection()** - register **connection** listener (**io.on('connection', fn)**)
* **@Disconnect()** - register disconnect socket event (**socket.on('disconnect', fn)**)

* **@Event(event: string, middleware || \[middleware\])** - register socket event (**socket.on**),
where middleware is a function which accepts four parameters:
```typescript
function middleware(io: SocketIO.Server | SocketIO.Namespace, socket: SocketIO.Socket, packet: [string, ...any], next: Function) {
    //
}
```

##### Parameter
* **@IO()** - returns server itself
* **@Socket()** - returns socket
* **@Args()** - returns event arguments (excluding callback)(if it exists)
* **@Callback()** - returns callback function (if it exists)

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
import {Event, Args, bootstrapSocketIO, Namespace } from '@decorators/socket';

const server = listen(3000);

@Namespace('/messaging')
class FirstController {

  @Event('message')
  onMessage(@Args() message) {
    console.log(`Message:  ${message}`);
  }

}

bootstrapSocketIO(server, [FirstController]);
```

### License
MIT

[Socket.IO]:http://socket.io/
