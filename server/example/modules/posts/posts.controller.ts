import { Controller, Pipe } from '@server';
import { Body, Get, Params, Post, Render } from '@server/http';
import { IsString } from 'class-validator';

import { PostsService } from '../../services';
import { Access, AccessParam } from './decorators';
import { AccessPipe } from './pipes';

class PostType {
  @IsString()
  title: string;
}

@Controller()
export class PostsController {
  constructor(private postsService: PostsService) { }

  @Post('', 200)
  create(@Body() post: PostType) {
    const list = this.postsService.getPosts();

    return [...list, post];
  }

  @Access('granted')
  @Pipe(AccessPipe)
  @Get(':id', 200)
  @Render('post')
  post(@Params('id', Number) id: number, @AccessParam() access: string) {
    return { access, id };
  }
}
