import { Controller, Get, Pipe } from '../../../src';
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
