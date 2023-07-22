import { Module } from '@server';

import { PostsModule, UsersModule } from './modules';

@Module({
  modules: [
    PostsModule,
    UsersModule,
  ],
})
export class AppModule { }
