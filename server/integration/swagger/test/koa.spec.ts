import { Application, HttpStatus, Module } from '@server';
import { HttpModule } from '@server/http';
import { KoaAdapter } from '@server/koa';
import { SwaggerModule } from '@server/swagger';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(KoaAdapter),
    SwaggerModule.forRoot(),
    AppModule,
  ],
})
class TestModule { }

describe('Express :: Swagger Route', () => {
  let app: Application;
  let module: HttpModule;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<HttpModule>(HttpModule);

    await module.listen();
  });

  afterEach(() => module.close());

  it('registers swagger file', async () => {
    return request(module.getHttpServer())
      .get('/swagger/swagger.json')
      .expect(HttpStatus.OK);
  });

  it('registers swagger-ui page', async () => {
    return request(module.getHttpServer())
      .get('/swagger')
      .expect(HttpStatus.OK);
  });
});
