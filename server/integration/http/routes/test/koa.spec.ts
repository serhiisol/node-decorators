import { Application, HttpStatus, Module } from '@server';
import { HttpModule } from '@server/http';
import { KoaAdapter } from '@server/koa';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(KoaAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Koa :: Routes', () => {
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
      .expect(HttpStatus.NO_CONTENT);
  });

  it('registers `options` request', async () => {
    return request(module.getHttpServer())
      .options('/options')
      .expect(HttpStatus.NO_CONTENT);
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
