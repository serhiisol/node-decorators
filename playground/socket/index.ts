import {
  Connect,
  Middleware,
  OnConnect,
  OnSocket,
  Args,
  Socket,
  IO,
  Callback,
  bootstrapSocketIO
} from '@decorators/socket'

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
