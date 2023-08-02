import { APP_VERSION, GLOBAL_PIPE, Module } from '@server';
import { ExpressAdapter } from '@server/express';
import { HttpModule } from '@server/http';

import { PostsModule } from './modules';
import { ServerPipe } from './pipes';
import { ServicesModule } from './services';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
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
