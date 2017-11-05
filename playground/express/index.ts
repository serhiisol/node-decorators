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
  constructor(@Inject(MESSAGE) private message: string) {}

  public use(error, req, res, next) {
    console.log('server error middleware', this.message);

    res.send(500);
  }
}

@Injectable()
class UserMiddleware implements Middleware {
  constructor(@Inject(MESSAGE) private message: string) {}

  public use(req, res, next) {
    console.log('middleware', this.message);

    next();
  }
}

@Controller('/')
@Injectable()
class UserController {

  constructor(@Inject(MESSAGE) private message: string) {}

  @Get('/user', [UserMiddleware])
  public getData(@Response() res): void {
    throw Error('User test error');
    // res.send(this.message);
  }

}

let app: express.Express = express();

Container.provide([
  { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
  { provide: MESSAGE, useValue: 'Express welcomes user' }
]);

attachControllers(app, [ UserController ]);

app.listen(3003);
