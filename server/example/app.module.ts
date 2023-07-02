import { APP_VERSION, GLOBAL_PIPE, HttpModule, Module } from '../src';
import { ExpressAdapter } from '../src/platforms/express';
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
      provide: GLOBAL_PIPE,
      useClass: ServerPipe,
      multi: true,
    },
  ],
})
export class AppModule { }