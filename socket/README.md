![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [Socket.IO]

### Installation
```
npm install @decorators/socket --save
```
### API
#### Functions
* **bootstrapSocketIO(rootController: Controller)** - creates server and registers root controller for that
  returns object with:
  ```
  interface SocketIOServer {
    attachController(controller);
    io: SocketIO.Server
  }
  ```
  * **controller(controller: Controller)** - registers new controller
  * **io** - SocketIO Server
#### Decorators
##### Class
* **@Connect(serverOrPort: number | string | HttpServer, opts?: any)** - creates server with options
* **@Middleware(fn: Function)** - registers middleware
##### Method
* **@OnIO(event: string)** - register global event (**io.on**)
* **@OnConnect()** - register **connection** listener (**io.on('connection', fn)**)
* **@OnConnection()** - alias of **@OnConnect**
* **@OnSocket(event: string)** - register socket event (**socket.on**);
##### Parameter
* **@IO()** - returns server itself
* **@Socket()** - returns socket
* **@Args()** - returns event arguments (excluding callback)(if it exists)
* **@Callback()** - returns callback function (if it exists)

### Quick Example:
```
import {
  Connect,
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
@Connect(3000)
@Middleware((socket, next) => {
  console.log('Middleware');
  next();
})
class ConnectClass {

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

let server = bootstrapSocketIO(ConnectClass);
server.attachController(AdditionalController);
...
...
...
```




[Socket.IO]:http://socket.io/
