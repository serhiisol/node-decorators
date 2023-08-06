import { Controller } from '@server';
import { Get } from '@server/http';

@Controller('', { ignoreVersion: true })
export class MiscController {
  @Get('*', 404)
  status404() {
    return 'not-found';
  }
}
