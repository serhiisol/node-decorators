import { Application, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';
import { json } from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Express Params', () => {
  let app: Application;
  let module: HttpModule;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<HttpModule>(HttpModule);

    module.use(json());
    module.use(cookieParser());

    await module.listen();
  });

  afterEach(() => module.close());

  it('receives `body` params', async () => {
    return request(module.getHttpServer())
      .post('/body')
      .send({ example: 'param' })
      .expect({ example: 'param', param: 'param' });
  });

  it('receives `cookies` params', async () => {
    return request(module.getHttpServer())
      .post('/cookies')
      .set('Cookie', ['example=param'])
      .expect({ cookie: 'param', example: 'param' });
  });

  it('receives `headers` params', async () => {
    return request(module.getHttpServer())
      .post('/headers')
      .set({ example: 'param' })
      .expect(({ body }) => expect(body).toEqual(expect.objectContaining({ example: 'param', header: 'param' })));
  });

  it('receives `params` params', async () => {
    return request(module.getHttpServer())
      .post('/params/param')
      .expect({ example: 'param', param: 'param' });
  });

  it('receives `query` params', async () => {
    return request(module.getHttpServer())
      .post('/query?example=param')
      .expect({ example: 'param', param: 'param' });
  });

  it('receives `request` param', async () => {
    return request(module.getHttpServer())
      .post('/request')
      .expect('/request');
  });

  it('receives `response` param', async () => {
    return request(module.getHttpServer())
      .post('/response')
      .expect('/response');
  });

  describe('with class validator', () => {
    it('passes validation', () => {
      return request(module.getHttpServer())
        .post('/with-class-validator')
        .send({ example: 'param' })
        .expect({ example: 'param' });
    });

    it('fails validation', () => {
      return request(module.getHttpServer())
        .post('/with-class-validator')
        .send({ example: 100 })
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
          expect(body.errors).toBeDefined();
        });
    });
  });

  describe('with custom validator', () => {
    it('passes validation', () => {
      return request(module.getHttpServer())
        .post('/with-custom-validator')
        .send({ example: 'param' })
        .expect('param');
    });

    it('fails validation', () => {
      return request(module.getHttpServer())
        .post('/with-custom-validator')
        .send({ example: 100 })
        .expect(({ body }) => {
          expect(body.message).toBeDefined();
        });
    });
  });
});
