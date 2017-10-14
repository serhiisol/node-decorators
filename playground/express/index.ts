import * as express from 'express';

import {
  Controller,
  Response,
  Get,
  attachControllers
} from '@decorators/express';

@Controller('/')
class UserController {

  @Get('/user')
  public getData(@Response() res): void {
    res.send('Express welcomes user');
  }

}

@Controller('/')
class TextController {

  @Get('/text')
  public getData(@Response() res): void {
    res.send('Express gives some text');
  }

}

let app: express.Express = express();

attachControllers(app, [ UserController, TextController ]);

app.listen(3003);
