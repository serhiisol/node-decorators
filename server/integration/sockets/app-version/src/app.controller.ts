import { Controller } from '@server';
import { Connection } from '@server/sockets';

@Controller()
export class AppController {
  @Connection()
  connection() { }
}
