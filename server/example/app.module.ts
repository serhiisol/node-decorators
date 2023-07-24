import { APP_VERSION, GLOBAL_PIPE, HttpModule, Module } from '@server';
import { ExpressAdapter } from '@server/express';

import { PostsModule, UsersModule } from './modules';
import { ServerPipe } from './pipes';
import { ServicesModule } from './services';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    UsersModule,
    PostsModule,
    ServicesModule,
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
