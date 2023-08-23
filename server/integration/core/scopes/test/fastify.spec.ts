import { Application, Module } from '@server';
import { FastifyAdapter } from '@server/fastify';
import { HttpModule } from '@server/http';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(FastifyAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Fastify :: Scopes', () => {
  let app: Application;

  beforeEach(async () => {
    app = await Application.create(TestModule);
  });

  it('creates app without errors', () => {
    expect(app).toBeDefined();
  });
});
