import { Application, HttpStatus, Module } from '@server';
import { FastifyAdapter } from '@server/fastify';
import { HttpModule } from '@server/http';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(FastifyAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Fastify :: Routes', () => {
  let app: Application;
  let module: HttpModule;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<HttpModule>(HttpModule);

    await module.listen();
  });

  afterEach(() => module.close());

  it('registers `delete` request', async () => {
    return request(module.getHttpServer())
      .delete('/delete')
      .expect(HttpStatus.OK, 'delete');
  });

  it('registers `get` request', async () => {
    return request(module.getHttpServer())
      .get('/get')
      .expect(HttpStatus.NO_CONTENT);
  });

  it('registers `head` request', async () => {
    return request(module.getHttpServer())
      .head('/head')
      .expect(HttpStatus.OK);
  });

  it('registers `options` request', async () => {
    return request(module.getHttpServer())
      .options('/options')
      .expect(HttpStatus.OK);
  });

  it('registers `patch` request', async () => {
    return request(module.getHttpServer())
      .patch('/patch')
      .expect(HttpStatus.OK, 'patch');
  });

  it('registers `post` request', async () => {
    return request(module.getHttpServer())
      .post('/post')
      .expect(HttpStatus.CREATED, 'post');
  });

  it('registers `put` request', async () => {
    return request(module.getHttpServer())
      .put('/put')
      .expect(HttpStatus.ACCEPTED, 'put');
  });
});
