import { Body, Controller, Cookies, Headers, Params, Post, Query, Request, Response } from '@server';

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
    return res['req']['url'];
  }

  @Post('with-class-validator')
  withClassValidator(
    @Body() body: BodyDto,
  ) {
    return body;
  }

  @Post('with-simple-validator/:example')
  withSimpleValidator(
    @Params('example') param: string,
  ) {
    return param;
  }
}
