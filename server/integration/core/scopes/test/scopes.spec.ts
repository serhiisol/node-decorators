import { Application, HttpModule, Module } from '@server';
import { ExpressAdapter } from '@server/express';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Scopes', () => {
  let app: Application;

  beforeEach(async () => {
    app = await Application.create(TestModule);
  });

  it('creates app without errors', () => {
    expect(app).toBeDefined();
  });
});
