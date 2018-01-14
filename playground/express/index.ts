import * as express from 'express';

import { Container, Injectable, Inject, InjectionToken } from '@decorators/di';
import {
  Controller,
  Response,
  Get,
  attachControllers,
  ERROR_MIDDLEWARE,
  ErrorMiddleware,
  Middleware
} from '@decorators/express';

const MESSAGE = new InjectionToken('MESSAGE');

@Injectable()
class ServerErrorMiddleware implements ErrorMiddleware {

  public use(error, req, res, next) {
    console.log('server error middleware', error.toString());

    res.send(500);
  }
}

@Controller('/')
class UserController {

  @Get('/')
  public async getData(@Response() res): Promise<any> {
    throw new Error('test error');
  }

}

let app: express.Express = express();

Container.provide([
  { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware }
]);

attachControllers(app, [ UserController ]);

app.listen(3000);
