import { Application, Module } from '@server';
import { SocketIoAdapter } from '@server/socket-io';
import { SocketsModule } from '@server/sockets';
import { connect, Socket } from 'socket.io-client';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    SocketsModule.create(SocketIoAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Socket.io :: App Version', () => {
  let app: Application;
  let module: SocketsModule;
  let socket: Socket;
  let port: number;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<SocketsModule>(SocketsModule);

    await module.listen();

    port = module.getHttpServer().address()['port'];
  });

  afterEach(() => module.close());
  afterEach(() => socket.disconnect());

  it('connects to a namespace with app version prefix', done => {
    socket = connect(`http://localhost:${port}/app-version`);

    socket.on('connect', () => {
      expect(socket.connected).toBeTruthy();

      done();
    });
  });
});
