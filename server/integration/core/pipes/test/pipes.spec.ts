import { Application, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { Sequence } from '../src/sequence';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    AppModule,
  ],
})
class TestModule { }

describe('Pipes', () => {
  let app: Application;
  let module: HttpModule;
  let seq: Sequence;

  beforeEach(async () => {
    app = await Application.create(TestModule);
    module = await app.inject<HttpModule>(HttpModule);
    seq = await app.inject<Sequence>(Sequence);

    jest.spyOn(seq, 'push');

    await module.listen();
  });

  afterEach(() => module.close());

  it('executes pipes', async () => {
    return request(module.getHttpServer())
      .get('/')
      .expect(() => {
        expect(seq.push).toBeCalledWith('server');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('server');
      });
  });

  it('executes pipes with method error', async () => {
    return request(module.getHttpServer())
      .get('/with-method-error')
      .expect((res) => {
        expect(res.body.message).toBe('method-error');
        expect(seq.push).toBeCalledWith('server');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('method');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('server');
      });
  });

  it('executes pipes with pipe error', async () => {
    return request(module.getHttpServer())
      .get('/with-pipe-error')
      .expect((res) => {
        expect(res.body.message).toBe('pipe-error');
        expect(seq.push).toBeCalledWith('server');
        expect(seq.push).toBeCalledWith('controller');
        expect(seq.push).toBeCalledWith('server');
      });
  });
});
