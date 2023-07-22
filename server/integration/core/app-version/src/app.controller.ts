import { Controller, Get } from '@server';

@Controller()
export class AppController {
  @Get('get')
  get() { }
}
