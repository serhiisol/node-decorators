import { Controller, Pipe } from '@server';
import { Event } from '@server/sockets';

import { Method } from './method';
import { Param } from './param';
import { DecoratorPipe } from './pipe';

@Controller()
@Pipe(DecoratorPipe)
export class AppController {
  @Method('decorated')
  @Event('message')
  event(@Param() param: string) {
    return param;
  }
}
