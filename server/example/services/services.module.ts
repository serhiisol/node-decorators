import { Module } from '@server';

import { PostsService } from './posts.service';

@Module({
  providers: [PostsService],
})
export class ServicesModule { }
