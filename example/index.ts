import * as express from 'express';
import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapExpress,
  Middleware,
  DecoratedExpress
} from '../index';
import { TestModel } from './model';


@Controller('/')
class TestController {

  @Get('/all/:id')
  @Middleware((req, res, next) => {
    console.log('Hello World');
    next();
  })
  getData(@Response() res, @Params('id') id: string) {
    let test = new TestModel();
    test.testField = "Hello World";
    (<any>TestModel).testMethod();
    test.instanceMethod();
    test.save(() => res.send('balalala ' + JSON.stringify(id)));
  }

}

let app: DecoratedExpress = <DecoratedExpress>express();

bootstrapExpress(app);

app.controller(TestController).listen(3003);
