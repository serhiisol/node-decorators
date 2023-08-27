import { Application, Module } from '@server';
import { SocketIoAdapter } from '@server/socket-io';
import { MetadataScanner, SocketsModule } from '@server/sockets';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    SocketsModule.create(SocketIoAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Socket.io :: Metadata Scanner', () => {
  let app: Application;
  let scanner: MetadataScanner;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    scanner = await app.inject<MetadataScanner>(MetadataScanner);
  });

  it('provides access to the metadata', () => {
    const eventsMetadata = scanner.scan();

    expect(eventsMetadata).toEqual(expect.arrayContaining([expect.objectContaining({
      methodName: 'message',
      params: expect.arrayContaining([expect.objectContaining({
        argName: 'message',
        index: 0,
        methodName: 'message',
      })]),
      type: 'event',
      url: '/',
    })]));
  });
});
