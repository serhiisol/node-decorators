import { Module } from '../../../src';
import { PostsController } from './posts.controller';

@Module({
  controllers: [PostsController],
  namespace: 'posts',
})
export class PostsModule { }
