import { Application, Module } from '@server';

import { AppModule } from '../src/app.module';

@Module({
  modules: [
    AppModule,
  ],
})
class TestModule { }

describe('Core :: Scopes', () => {
  let app: Application;

  beforeEach(async () => {
    app = await Application.create(TestModule);
  });

  it('creates app without errors', () => {
    expect(app).toBeDefined();
  });
});
