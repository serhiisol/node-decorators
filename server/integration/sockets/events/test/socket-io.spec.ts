import { Application, Module } from '@server';
import { SocketIoAdapter } from '@server/socket-io';
import { SocketsModule } from '@server/sockets';
import { connect, Socket } from 'socket.io-client';

import { AppModule } from '../src/app.module';
import { Sequence } from '../src/sequence';

@Module({
  modules: [
    SocketsModule.create(SocketIoAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Socket.io :: Events', () => {
  let app: Application;
  let module: SocketsModule;
  let socket: Socket;
  let port: number;
  let seq: Sequence;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<SocketsModule>(SocketsModule);
    seq = await app.inject<Sequence>(Sequence);

    jest.spyOn(seq, 'push');

    await module.listen();

    port = module.getHttpServer().address()['port'];
  });

  afterEach(() => module.close());
  afterEach(() => socket.disconnect());

  it('registers `connection` event', (done) => {
    socket = connect(`http://localhost:${port}`);

    socket.on('connect', () => {
      expect(seq.push).toBeCalledWith('connection');

      done();
    });
  });

  it('registers `disconnect` + `disconnecting` events', (done) => {
    socket = connect(`http://localhost:${port}`);

    socket.on('connect', () => {
      jest.resetAllMocks();
      socket.disconnect();

      setTimeout(() => {
        expect(seq.push).toBeCalledWith('disconnecting');
        expect(seq.push).toBeCalledWith('disconnect');

        done();
      }, 1000);
    });
  });

  it('registers `event` event', (done) => {
    socket = connect(`http://localhost:${port}`);

    socket.on('connect', () => {
      jest.resetAllMocks();

      socket.emit('message', () => {
        expect(seq.push).toBeCalledWith('event');

        done();
      });
    });
  });
});
