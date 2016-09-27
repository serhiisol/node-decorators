import * as express from 'express';

import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapExpress,
  Middleware
} from '../../index';

@Controller('/')
class TestController {

  @Get('/favicon.ico')
  getFavicon(@Response() res) {
    res.status(404).send();
  }

  @Get('/:id')
  @Middleware((req, res, next) => {
    console.log('Second Middleware');
    next();
  })
  @Middleware((req, res, next) => {
    console.log('first Middleware');
    next();
  })
  getData(@Response() res, @Params('id') id: string) {
    console.log('Express welcomes: ' + JSON.stringify(id));
    res.send('Express welcomes: ' + JSON.stringify(id));
  }

}

let app: any = bootstrapExpress(express());
app.controller(TestController).listen(3003);
