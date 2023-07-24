import { Body, Controller, Post } from '@server';

@Controller()
export class AppController {
  @Post()
  post(
    @Body() body: object,
  ) {
    return { ...body };
  }
}
