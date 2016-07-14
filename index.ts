import { Request, Response, Controller, RouteGet, App, Middleware } from './decorators';

@Controller('/')
class Test {

  @RouteGet('/all')
  @Middleware((req, res, next) => {
    console.log('Hello World');
    next();
  })
  getData(@Response() res, @Request() req) {
    res.send('balalala');
  }

}

let app = App();

app.controller(Test)
  .listen(3000);
