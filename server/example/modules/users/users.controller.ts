import { Controller, Pipe } from '@server';
import { Get } from '@server/http';

import { ExclamationPipe, QuestionPipe, UnderscorePipe } from './pipes';

@Controller()
@Pipe(QuestionPipe)
export class UsersController {
  @Get('', 200)
  @Pipe(ExclamationPipe)
  @Pipe(UnderscorePipe)
  list() {
    return [{ name: 'hello world' }];
  }
}
