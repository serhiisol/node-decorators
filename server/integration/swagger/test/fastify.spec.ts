import { Application, HttpStatus, Module } from '@server';
import { FastifyAdapter } from '@server/fastify';
import { HttpModule } from '@server/http';
import { SwaggerModule } from '@server/swagger';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(FastifyAdapter),
    SwaggerModule.forRoot(),
    AppModule,
  ],
})
class TestModule { }

describe('Fastify :: Swagger Route', () => {
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
      .expect(301);
  });
});
