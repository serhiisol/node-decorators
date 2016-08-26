import * as express from 'express';
import {
  Response,
  Controller,
  Middleware,
  Get,
  bootstrapExpress,
} from '../../express';
import { Async } from '../../co';

let testAsyncFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('testAsyncFunc');
      resolve()
    }, 3000);
  });
};

@Controller('/')
class TestController {

  @Get('/')
  @Async
  @Middleware((req, res, next) => {
    console.log('Second Middleware');
    next();
  })
  @Middleware((req, res, next) => {
    console.log('first Middleware');
    next();
  })
  *getData(@Response() res) {
    console.log('code before async function');
    yield testAsyncFunc();
    console.log('code after async function');
    res.send('Success');
  }

}

let app: any = bootstrapExpress(express());
app.controller(TestController).listen(3003);
