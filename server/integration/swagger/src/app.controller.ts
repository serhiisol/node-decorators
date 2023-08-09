import { Controller } from '@server';
import { Get } from '@server/http';

@Controller()
export class AppController {
  @Get('get')
  get() { }
}
