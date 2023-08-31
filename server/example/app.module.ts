import { APP_VERSION, GLOBAL_PIPE, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { FastifyAdapter } from '@server/fastify';
import { HttpModule } from '@server/http';
import { KoaAdapter } from '@server/koa';
import { SocketIoAdapter } from '@server/socket-io';
import { SocketsModule } from '@server/sockets';
import { SwaggerModule } from '@server/swagger';

import { EventsModule, MessagesModule, MiscModule } from './modules';
import { ServerPipe } from './pipes';

@Module({
  modules: [
    HttpModule.create(
      process.env.USE_FASTIFY ? FastifyAdapter : process.env.USE_KOA ? KoaAdapter : ExpressAdapter,
    ),
    SwaggerModule.forRoot({
      description: 'Decorators Example App',
      title: '@decorators/server',
    }),
    SocketsModule.create(SocketIoAdapter),
    EventsModule,
    MessagesModule,
    MiscModule,
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
