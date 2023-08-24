import { Application, Module } from '@server';
import { HttpModule } from '@server/http';
import { MetadataScanner } from '@server/http';
import { KoaAdapter } from '@server/koa';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(KoaAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Koa :: Metadata Scanner', () => {
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
