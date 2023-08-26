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

describe('Socket.io :: Pipes', () => {
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

  it('executes pipes', (done) => {
    socket = connect(`http://localhost:${port}`);

    socket.on('connect', () => {
      socket.emit('message', () => {
        expect(seq.push).toBeCalledWith('server');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('server');

        done();
      });
    });
  });

  it('executes pipes with method error', (done) => {
    socket = connect(`http://localhost:${port}`);

    socket.on('connect', () => {
      socket.emit('with-method-error', () => {
        throw new Error('shouldn\'t be called');
      });

      socket.on('error', (error) => {
        expect(error.message).toBe('method-error');
        expect(seq.push).toBeCalledWith('server');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('server');

        done();
      });
    });
  });

  it('executes pipes with pipe error', (done) => {
    socket = connect(`http://localhost:${port}`);

    socket.on('connect', () => {
      socket.emit('with-method-error', () => {
        throw new Error('shouldn\'t be called');
      });

      socket.on('error', (error) => {
        expect(error.message).toBe('method-error');
        expect(seq.push).toBeCalledWith('server');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('server');

        done();
      });
    });
  });
});
