import * as express from 'express';
import { Express } from 'express';

import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapControllers,
  Middleware
} from '@decorators/express';

@Controller('/')
class TestController {

  @Get('/favicon.ico')
  getFavicon(@Response() res) {
    res.status(404).send();
  }

  @Get('/:id')
  @Middleware([(req, res, next) => {
    console.log('First Middleware');
    next();
  }, (req, res, next) => {
    console.log('Second Middleware');
    next();
  }])
  getData(@Response() res, @Params('id') id: string) {
    console.log('Express welcomes: ' + JSON.stringify(id));
    res.send('Express welcomes: ' + JSON.stringify(id));
  }

}

let app: Express = express();

bootstrapControllers(app, [TestController]);

app.listen(3003);
