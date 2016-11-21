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
* **@Controller(namespace: string)** - registers controller for namespace
* **@Middleware(fn: Function)** - registers global (io) middleware
* **@SocketMiddleware(fn: Function)** - registers socket middleware
##### Method
* **@OnIO(event: string)** - register global event (**io.on**)
* **@OnConnect()** - register **connection** listener (**io.on('connection', fn)**)
* **@OnConnection()** - alias of **@OnConnect**
* **@OnSocket(event: string)** - register socket event (**socket.on**);
* **@OnDisconnect()** - register disconnect socket event (**socket.on('disconnect', fn)**);
##### Parameter
* **@IO()** - returns server itself
* **@Socket()** - returns socket
* **@Args()** - returns event arguments (excluding callback)(if it exists)
* **@Callback()** - returns callback function (if it exists)

### Quick Example:
```typescript
import { listen } from 'socket.io';
import {
  Middleware,
  SocketMiddleware,
  OnConnect,
  OnSocket,
  Args,
  bootstrapSocketIO,
  Controller
} from '@decorators/socket'

const server = listen(3000);

@Middleware((socket, next) => {
  console.log('Global IO Middleware');
  next();
})
@SocketMiddleware((socket, next) => {
  console.log('Middleware for each single event');
  next();
})
@Controller('/messaging')
class FirstController {

  @OnConnect()
  onConnection() {
    console.log('User connected');
  }

  @OnSocket('message')
  onMessage(@Args() message) {
    console.log(`Message:  ${message}`);
  }

}

bootstrapSocketIO(server, [FirstController]);
...
```
[Socket.IO]:http://socket.io/
