import { ApiError, Controller, Pipe } from '@server';
import { Event } from '@server/sockets';

import { ControllerPipe, MethodPipe } from './pipes';

@Controller()
@Pipe(ControllerPipe)
export class AppController {
  @Event('message')
  @Pipe(MethodPipe)
  message() { }

  @Event('with-method-error')
  @Pipe(MethodPipe)
  withMethodError() {
    throw new ApiError('method-error');
  }
}
