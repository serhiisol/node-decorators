import * as express from 'express';
import { Express, Request } from 'express';

import {
  Response,
  Request as Req,
  Params,
  Controller,
  Get,
  attachControllers
} from '@decorators/express';

@Controller('/', (req: Request, res, next) => {
  console.log('Controller Middleware', req.path);
  next();
})
class UsersController {

  @Get('/favicon.ico')
  getFavicon(@Response() res) {
    res.status(404).send();
  }

  @Get('/:id', [(req, _res, next) => {
    console.log('First Middleware');
    next();
  }, (req, _res, next) => {
    console.log('Second Middleware');
    next();
  }])
  getData(@Response() res, @Params('id') id: string, @Req('params') params) {
    console.log('Express welcomes: ' + JSON.stringify(id));
    res.send('Express welcomes: ' + JSON.stringify(id));
  }

}

let app: Express = express();

attachControllers(app, [ UsersController ]);

app.listen(3003);
