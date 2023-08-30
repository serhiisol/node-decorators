import { APP_VERSION, Application, HttpStatus, Module } from '@server';
import { HttpModule } from '@server/http';
import { KoaAdapter } from '@server/koa';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(KoaAdapter),
    AppModule,
  ],
  providers: [
    { provide: APP_VERSION, useValue: 'app-version' },
  ],
})
class TestModule { }

describe('Koa :: App Version', () => {
  let app: Application;
  let module: HttpModule;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<HttpModule>(HttpModule);

    await module.listen();
  });

  afterEach(() => module.close());

  it('registers `get` request with app version prefix', async () => {
    return request(module.getHttpServer())
      .get('/app-version/get')
      .expect(HttpStatus.NO_CONTENT);
  });
});
