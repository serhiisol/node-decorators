import { Controller, Pipe } from '@server';
import { Body, Get, Params, Post, Render } from '@server/http';
import { ApiParameter, ApiResponse, ApiResponseSchema, ApiSecurity } from '@server/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { PostsService } from '../../services';
import { Access, AccessParam } from './decorators';
import { AccessPipe } from './pipes';

class PostType {
  @IsNumber()
  @Min(5)
  @Max(10)
  @ApiParameter({
    description: 'Super Count',
  })
  @IsOptional()
  count: number;

  @IsString({ each: true })
  @IsOptional()
  name: string[];

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
  @ApiResponse('Returns newly created post')
  @ApiResponseSchema({
    200: {
      description: 'Returns newly created post',
      type: PostType,
    },
  })
  @ApiSecurity({
    description: 'Auth',
    in: 'query',
    name: 'access',
    type: 'apiKey',
  })
  // @ApiBearerAuth()
  @Get(':id', 200)
  @Render('post')
  post(@Params('id', Number) id: number, @AccessParam() access: string) {
    return { access, id };
  }
}
