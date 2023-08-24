import { Application, Module } from '@server';
import { HttpModule } from '@server/http';
import { KoaAdapter } from '@server/koa';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(KoaAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Koa :: Scopes', () => {
  let app: Application;

  beforeEach(async () => {
    app = await Application.create(TestModule);
  });

  it('creates app without errors', () => {
    expect(app).toBeDefined();
  });
});
