import { ApiError, Controller, Pipe } from '@server';
import { Get } from '@server/http';

import { ControllerPipe, MethodPipe } from './pipes';

@Controller()
@Pipe(ControllerPipe)
export class AppController {
  @Get()
  @Pipe(MethodPipe)
  get() { }

  @Get('with-method-error')
  @Pipe(MethodPipe)
  withMethodError() {
    throw new ApiError('method-error');
  }

  @Get('with-pipe-error')
  @Pipe(MethodPipe)
  withPipeError() { }
}
