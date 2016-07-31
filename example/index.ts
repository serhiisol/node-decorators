import * as express from 'express';
import { DecoratedExpress } from 'node-decorators/express';
import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapExpress,
  Middleware
} from '../express';
import { TestModel } from './model';


@Controller('/')
class TestController {

  @Get('/all/:id')
  @Middleware((req, res, next) => {
    console.log('Hello World');
    next();
  })
  getData(@Response() res, @Params('id') id: string) {
    TestModel.staticMethod()
    let test = new TestModel();
    test.testField = "Hello World";
    test.instanceMethod();
    test.save(() => res.send('balalala ' + JSON.stringify(id)));
  }

}

let app: DecoratedExpress = bootstrapExpress(express());


app.controller(TestController).listen(3003);
