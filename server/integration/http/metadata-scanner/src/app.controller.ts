import { Controller } from '@server';
import { Body, Post } from '@server/http';

@Controller()
export class AppController {
  @Post()
  post(
    @Body() body: object,
  ) {
    return { ...body };
  }
}
