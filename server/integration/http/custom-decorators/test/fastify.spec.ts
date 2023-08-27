import { Application, Module, Reflector } from '@server';
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

describe('Fastify :: Custom Decorators', () => {
  let app: Application;
  let module: HttpModule;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<HttpModule>(HttpModule);

    await module.listen();
  });

  afterEach(() => module.close());

  it('checks availability of reflector', async () => {
    expect(await app.inject(Reflector)).toBeDefined();
  });

  it('decorates `get` request and its params', async () => {
    return request(module.getHttpServer())
      .get('/?param=decorated')
      .expect('decorated');
  });

  it('throws error during `get` request', async () => {
    return request(module.getHttpServer())
      .get('/?param=failure')
      .expect(({ body }) => expect(body.message).toEqual('decorated-error'));
  });
});
