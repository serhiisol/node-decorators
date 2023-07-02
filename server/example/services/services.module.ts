import { Module } from '../../src';
import { PostsService } from './posts.service';

@Module({
  providers: [PostsService],
})
export class ServicesModule { }
