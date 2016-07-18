import * as express from 'express';
import { Request, Response, Params, Controller, Get, decorateExpressApp, Middleware, DecoratedExpress } from '../index';

@Controller('/')
class Test {

  @Get('/all/:id')
  // @Middleware((req, res, next) => {
  //   console.log('Hello World');
  //   next();
  // })
  getData(@Response() res, @Request() req, @Params('id') id: string) {
    res.send('balalala ' + JSON.stringify(id));
  }

}

// let app = App();
//
// app.controller(Test)
//   .listen(3000);

let app: DecoratedExpress = <DecoratedExpress>express();

decorateExpressApp(app);

app.controller(Test).listen(3000);
