import * as express from 'express';
import { Container, Injectable } from '@decorators/di';
import {
  Controller,
  Response,
  Get,
  attachControllers,
  ERROR_MIDDLEWARE,
  ErrorMiddleware
} from '@decorators/express';

async function emulatedRequest(): Promise<any> {
  return new Promise(resolve =>
    setTimeout(resolve, 3000)
  );
}

@Injectable()
class ServerErrorMiddleware implements ErrorMiddleware {

  async use(error, _req, res) {
    await emulatedRequest();

    res.status(500).send(error.toString());
  }
}

@Controller('/')
class UserController {

  @Get('/')
  getData(@Response() res) {
    throw new Error('Handler error');
  }

}

/**
 * Server configuration
 */

const app: express.Express = express();

app.set('env', 'test');

Container.provide([
  {
    provide: ERROR_MIDDLEWARE,
    useClass: ServerErrorMiddleware
  }
]);

attachControllers(app, [ UserController ]);

app.listen(3000);

console.log('Server is running on http://localhost:3000');
