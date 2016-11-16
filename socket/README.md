![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [Socket.IO]

### Installation
```
npm install @decorators/socket --save
```
### API
#### Functions
* **bootstrapSocketIO(serverOrPort: any, options?: any)** - creates server and registers root controller for that
  returns object with:
  ```
  interface SocketIOServer {
    attachController(controller);
    attachControllers(controllers);
    io: SocketIO.Server
  }
  ```
  * **attachController(controller: Controller)** - registers new controller
  * **attachControllers(controllers: Controller[])** - registers new controllers
  * **io** - SocketIO Server
#### Decorators
##### Class
* **@Middleware(fn: Function)** - registers middleware
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
