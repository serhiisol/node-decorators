import { APP_VERSION, GLOBAL_PIPE, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { FastifyAdapter } from '@server/fastify';
import { HttpModule } from '@server/http';
import { SwaggerModule } from '@server/swagger';

import { MiscModule, PostsModule } from './modules';
import { ServerPipe } from './pipes';

@Module({
  modules: [
    HttpModule.create(
      process.env.USE_FASTIFY ? FastifyAdapter : ExpressAdapter,
    ),
    SwaggerModule.forRoot({
      description: 'Decorators Example App',
      title: '@decorators/server',
    }),
    MiscModule,
    PostsModule,
  ],
  providers: [
    {
      provide: APP_VERSION,
      useValue: 'v1',
    },
    {
      multi: true,
      provide: GLOBAL_PIPE,
      useClass: ServerPipe,
    },
  ],
})
export class AppModule { }
