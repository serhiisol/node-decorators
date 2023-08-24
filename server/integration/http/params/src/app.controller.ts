import { Controller } from '@server';
import { Body, Cookies, Headers, Params, Post, Query, Request, Response } from '@server/http';

import { BodyDto } from './body.dto';

@Controller()
export class AppController {
  @Post('body')
  body(
    @Body() body: object,
    @Body('example') param: string,
  ) {
    return { ...body, param };
  }

  @Post('cookies')
  cookies(
    @Cookies() cookies: object,
    @Cookies('example') cookie: string,
  ) {
    return { ...cookies, cookie };
  }

  @Post('headers')
  headers(
    @Headers() headers: object,
    @Headers('example') header: string,
  ) {
    return { ...headers, header };
  }

  @Post('params/:example')
  params(
    @Params() params: object,
    @Params('example') param: string,
  ) {
    return { ...params, param };
  }

  @Post('query')
  query(
    @Query() params: object,
    @Query('example') param: string,
  ) {
    return { ...params, param };
  }

  @Post('request')
  request(
    @Request() req: object,
  ) {
    return req['url'];
  }

  @Post('response')
  response(
    @Response() res: object,
  ) {
    if (res['req']) {
      return res['req']['url'];
    }

    return res['request']['url'];
  }

  @Post('with-class-validator')
  withClassValidator(
    @Body() body: BodyDto,
  ) {
    return body;
  }

  @Post('with-custom-validator')
  withCustomValidator(
    @Body('example', (arg: unknown) => typeof arg === 'string') param: string,
  ) {
    return param;
  }
}
