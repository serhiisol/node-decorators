import { Application, HttpStatus, Module } from '@server';
import { HttpModule } from '@server/http';
import { KoaAdapter } from '@server/koa';
import * as koaViews from 'koa-views';
import { join } from 'path';
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

    module.use(koaViews(join(__dirname, '..', 'src'), {
      autoRender: false,
      extension: 'ejs',
    }));

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

  it('registers `*` request', async () => {
    return request(module.getHttpServer())
      .get('/does-not-exist')
      .expect(HttpStatus.NOT_FOUND, 'not-found');
  });

  describe('Render', () => {
    it('renders view', async () => {
      return request(module.getHttpServer())
        .get('/render')
        .expect((req) => {
          expect(req.status).toBe(HttpStatus.OK);
          expect(req.text).toContain('Hello World');
        });
    });

    it('renders non-existing view', async () => {
      return request(module.getHttpServer())
        .get('/render-missing')
        .expect((req) => {
          expect(req.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
          expect(req.body.message).toBeDefined();
        });
    });
  });
});
