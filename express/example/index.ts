/* eslint-disable max-classes-per-file */

import * as express from 'express';
import { Container, Injectable } from '@decorators/di';
import { attachControllers, Controller, ERROR_MIDDLEWARE, ErrorMiddleware, Get, Middleware } from '../src';

const app: express.Express = express();

class NotFoundError extends Error { }
class InternalServerError extends Error { }

@Injectable()
class DataProvider {
  data() {
    return { hello: 'world' };
  }
}

@Injectable()
class RequestMiddleware implements Middleware {
  constructor(private dataProvider: DataProvider) { }

  use(_request: express.Request, _response: express.Response, next: express.NextFunction) {
    console.log('RequestMiddleware', this.dataProvider.data());

    next();
  }
}

@Controller('/', [RequestMiddleware])
class IndexController {
  @Get('/')
  index() {
    return 'Hello World';
  }

  @Get('/not-found-error')
  notFoundError() {
    throw new NotFoundError();
  }

  @Get('/internal-server-error')
  internalServerError() {
    throw new InternalServerError();
  }
}

@Injectable()
class ServerErrorMiddleware implements ErrorMiddleware {

  constructor(private dataProvider: DataProvider) { }

  use(error: Error, _request: express.Request, response: express.Response, next: express.NextFunction) {
    console.log(this.dataProvider.data());

    if (error instanceof NotFoundError) {
      return response.send('Not Found Error');
    }

    if (error instanceof InternalServerError) {
      return response.send('Internal Server Error');
    }

    next(error);
  }
}

export async function start() {
  Container.provide([
    { provide: DataProvider, useClass: DataProvider },
    { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
  ]);

  await attachControllers(app, [IndexController]);

  app.listen(3000, () => {
    console.info('Server is running on port 3000');
  });
}

start().catch(console.error);
