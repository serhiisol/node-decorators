import {
  Middleware,
  OnConnect,
  OnSocket,
  Args,
  Socket,
  IO,
  Callback,
  bootstrapSocketIO
} from '@decorators/socket'

@Middleware((socket, next) => {
  console.log('Middleware 1');
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

@Middleware((socket, next) => {
  console.log('Middleware 2');
  next();
})
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
