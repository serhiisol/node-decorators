import { Application, Module } from '@server';
import { FastifyAdapter } from '@server/fastify';
import { HttpModule } from '@server/http';
import { MetadataScanner } from '@server/http';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(FastifyAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Fastify :: Metadata Scanner', () => {
  let app: Application;
  let scanner: MetadataScanner;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    scanner = await app.inject<MetadataScanner>(MetadataScanner);
  });

  it('provides access to the metadata', () => {
    const routesMetadata = scanner.scan();

    expect(routesMetadata).toEqual(expect.arrayContaining([expect.objectContaining({
      methodName: 'post',
      params: expect.arrayContaining([expect.objectContaining({
        argName: 'body',
        index: 0,
        methodName: 'post',
      })]),
      type: 'post',
      url: '/',
    })]));
  });
});
