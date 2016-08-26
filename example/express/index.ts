import * as express from 'express';
import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapExpress,
  Middleware
} from '../../express';

@Controller('/')
class TestController {

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
    res.send('Express welcomes: ' + JSON.stringify(id));
  }

}

let app: any = bootstrapExpress(express());
app.controller(TestController).listen(3003);
