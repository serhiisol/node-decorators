import { Application, Module, Reflector } from '@server';
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

describe('Socket.io :: Custom Decorators', () => {
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
  afterEach(() => socket?.disconnect());

  it('checks availability of reflector', async () => {
    expect(await app.inject(Reflector)).toBeDefined();
  });

  it('decorates `message` event and its params', (done) => {
    socket = connect(`http://localhost:${port}?param=decorated`);

    socket.on('connect', () => {
      socket.emit('message', (param: string) => {
        expect(param).toBe('decorated');

        done();
      });
    });
  });

  it('throws error during `message` event', (done) => {
    socket = connect(`http://localhost:${port}?param=failure`);

    socket.on('connect', () => {
      socket.emit('message', () => {
        throw new Error('shouldn\'t be called');
      });

      socket.on('error', error => {
        expect(error.message).toBe('decorated-error');

        done();
      });
    });
  });
});
