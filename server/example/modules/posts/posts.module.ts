import { Module } from '@server';

import { PostsController } from './posts.controller';

@Module({
  controllers: [PostsController],
  namespace: 'posts',
})
export class PostsModule { }
