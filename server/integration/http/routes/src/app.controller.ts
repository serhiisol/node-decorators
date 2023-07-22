import { Controller, Delete, Get, Head, HttpStatus, Options, Patch, Post, Put } from '@server';

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
  Put() {
    return 'put';
  }
}
