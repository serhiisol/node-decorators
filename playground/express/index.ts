import * as express from 'express';

import { Container, Injectable, Inject, InjectionToken } from '@decorators/di';
import {
  Controller,
  Response,
  Get,
  attachControllers
} from '@decorators/express';

const MESSAGE = new InjectionToken('MESSAGE');

@Injectable()
class Middleware {
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

  @Get('/user', [Middleware])
  public getData(@Response() res): void {
    res.send(this.message);
  }

}

let app: express.Express = express();

Container.provide([
  { provide: MESSAGE, useValue: 'Express welcomes user' }
]);

attachControllers(app, [ UserController ]);

app.listen(3003);
