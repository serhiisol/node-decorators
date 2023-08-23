import { Application, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Express :: Scopes', () => {
  let app: Application;

  beforeEach(async () => {
    app = await Application.create(TestModule);
  });

  it('creates app without errors', () => {
    expect(app).toBeDefined();
  });
});
