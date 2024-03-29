import * as FastifyView from '@fastify/view';
import { Application } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';
import { SocketsModule } from '@server/sockets';
import { json } from 'body-parser';
import { renderFile } from 'ejs';
import * as koaBodyparser from 'koa-bodyparser';
import * as koaViews from 'koa-views';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await Application.create(AppModule);
  const module = await app.inject<HttpModule>(HttpModule);
  const sockets = await app.inject<SocketsModule>(SocketsModule);

  if (process.env.USE_FASTIFY) {
    module.use(FastifyView, {
      engine: {
        ejs: require('ejs'),
      },
      root: join(__dirname, 'views'),
    });
  } else if (process.env.USE_KOA) {
    module.use(koaViews(join(__dirname, 'views'), {
      autoRender: false,
      extension: 'html',
      map: {
        html: 'ejs',
      },
    }));
    module.use(koaBodyparser());
  } else {
    const expressApp = module.getAdapter<ExpressAdapter>().app;

    expressApp.engine('html', renderFile);
    module.set('view engine', 'html');
    module.set('views', join(__dirname, 'views'));
    module.use(json());
  }

  await module.listen(3000);
  await sockets.listen();

  console.info('Server is running on port 3000');
}

bootstrap().catch(console.error);
