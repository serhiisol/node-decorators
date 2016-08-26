import * as express from 'express';
import { Response, Controller, Get, bootstrapExpress } from '../../express';
import { TestModel } from './model';

@Controller('/')
class TestController {

  @Get('/')
  getData(@Response() res) {
    TestModel.staticMethod();
    let test = new TestModel();
    test.testField = "Hello World";
    test.instanceMethod();
    test.save(() => res.send('Mongoose <br/>' + test.toString()));
  }

}

let app: any = bootstrapExpress(express());
app.controller(TestController).listen(3003);
