import { Application, HttpStatus, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('App Version', () => {
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
      .expect(HttpStatus.OK);
  });
});
