import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapExpress,
  Middleware
} from '../../../index';

@Controller('/')
export class TestController {

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
