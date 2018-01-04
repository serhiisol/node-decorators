![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for [Socket.IO]

### Installation
```
npm install @decorators/socket --save
```
### API

#### Decorators
##### Class
* **@Controller(namespace?: string, middleware?: Middleware[])** - registers controller for controller

##### Method
* **@Connection(middleware?: Middleware[])** - register **connection** listener (**io.on('connection', fn)**)
* **@Connect(middleware?: Middleware[])** - alias of **@Connection()**
* **@Disconnect(middleware?: Middleware[])** - register disconnect socket event (**socket.on('disconnect', fn)**)
* **@GlobalEvent(event: string)** - register global event (**io.on**)
* **@Event(event: string, middleware?: Middleware[])** - register socket event (**socket.on**)

##### Parameter
* **@IO(WrapperClass?: Class)** - returns server itself
* **@Socket(WrapperClass?: Class)** - returns socket
If **WrapperClass** provided, returns instance
of **WrapperClass**, passes **socket** or **server** as dependency into **WrapperClass**
```typescript
class SocketWrapper {
  constructor(
    private ioSock: SocketIO.Server|SocketIO.Namespace|SocketIO.Socket
  ) {}
}
```
* **@Args()** - returns event arguments (excluding callback, if it exists)
* **@Ack()** - returns ack callback function (if it exists)

#### Helper Functions
* **attachControllers(io: SocketIO.Server, Controller[])** -  Attaches controllers to IO server

##### Middleware
Middleware is a class, that implements interface **Middleware**, like so:
```typescript
class ControllerMiddleware implements Middleware {
  public use(
    io: SocketIO.Server | SocketIO.Namespace,
    socket: SocketIO.Socket,
    args: any,
    next: Function
  ) {
    console.log('ControllerMiddleware');
    next();
  }
}
```
To register global middleware handler, use **IO_MIDDLEWARE** injection token with **Container** from `@decorators/di` package, like so:

```typescript
Container.provide([
  { provide: IO_MIDDLEWARE, useClass: ServerMiddleware }
]);
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
