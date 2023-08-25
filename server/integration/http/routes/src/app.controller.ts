import { Controller, HttpStatus } from '@server';
import { Delete, Get, Head, Options, Patch, Post, Put, Render } from '@server/http';

@Controller()
export class AppController {
  @Delete('delete', HttpStatus.OK)
  delete() {
    return 'delete';
  }

  @Get('get', HttpStatus.NO_CONTENT)
  get() { }

  @Head('head', HttpStatus.OK)
  head() { }

  @Options('options')
  options() { }

  @Patch('patch', HttpStatus.OK)
  patch() {
    return 'patch';
  }

  @Post('post', HttpStatus.CREATED)
  post() {
    return 'post';
  }

  @Put('put', HttpStatus.ACCEPTED)
  put() {
    return 'put';
  }

  @Get('*', 404)
  status404() {
    return 'not-found';
  }

  @Get('render')
  @Render('view')
  tryRender() {
    return { message: 'Hello World' };
  }

  @Get('render-missing')
  @Render('missing')
  tryRenderMissing() {
    return { message: 'Hello World' };
  }
}
