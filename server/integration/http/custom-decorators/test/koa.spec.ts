import { Application, Module, Reflector } from '@server';
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

describe('Koa :: Custom Decorators', () => {
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
