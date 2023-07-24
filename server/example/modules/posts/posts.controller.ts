import { Body, Controller, Get, Params, Pipe, Post, Render } from '@server';
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

  @Access('granted')
  @Pipe(AccessPipe)
  @Post('', 200)
  create(@Body() post: PostType, @AccessParam() access: string) {
    return { ...post, access };
  }

  @Get('', 200)
  list() {
    return this.postsService.list();
  }

  @Get(':id', 200)
  @Render('post')
  post(@Params('id') id: string) {
    return { id, name: 'hello world' };
  }
}
