import { Controller, Pipe } from '@server';
import { Get } from '@server/http';

import { Method } from './method';
import { Param } from './param';
import { DecoratorPipe } from './pipe';

@Controller()
@Pipe(DecoratorPipe)
export class AppController {
  @Method('decorated')
  @Get()
  get(@Param() param: string) {
    return param;
  }
}
