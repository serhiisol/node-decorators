import { Application, MetadataScanner, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Express :: Metadata Scanner', () => {
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
