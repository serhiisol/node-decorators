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
```
import {
  Middleware,
  OnConnect,
  OnIO,
  OnSocket,
  Args,
  Socket,
  IO,
  Callback,
  bootstrapSocketIO
} from '../index'
...
...
...

@Middleware((socket, next) => {
  console.log('Middleware');
  next();
})
class ConnectionController {

  @OnConnect()
  onConnection() {
    console.log('ConnectClass @OnConnect');
  }

  @OnSocket('register')
  onRegister(@Socket() socket, @Callback() callback, @Args() args, @IO() io) {
    console.log('ConnectClass @OnSocket', args);
  }

}

class AdditionalController {

  @OnConnect()
  onConnection() {
    console.log('AdditionalController @OnConnect');
  }

  @OnSocket('message')
  onMessage(@Socket() socket, @Callback() callback, message) {
    console.log('AdditionalController @OnSocket', message);
  }

}

bootstrapSocketIO(3000)
  .attachControllers([
    ConnectionController,
    AdditionalController
  ]);
...
...
...
```




[Socket.IO]:http://socket.io/
