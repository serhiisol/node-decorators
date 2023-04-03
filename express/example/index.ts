import * as express from 'express';
import { Container } from '@decorators/di';
import { attachControllers, Controller, ERROR_MIDDLEWARE, ErrorMiddleware, Get } from '../src';

const app: express.Express = express();

class NotFoundError extends Error {}
class InternalServerError extends Error {}

@Controller('/')
class IndexController {
  @Get('/')
  index() {
    return 'Hello World'
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

class ServerErrorMiddleware implements ErrorMiddleware {
  use(error: Error, _: express.Request, response: express.Response, next: express.NextFunction) {
    if (error instanceof NotFoundError) {
      return response.send('Not Found Error');
    }

    if (error instanceof InternalServerError) {
      return response.send('Internal Server Error');
    }

    next(error);
  }
}

export function start() {
  Container.provide([
    { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware }
  ]);

  attachControllers(app, [IndexController]);

  app.listen(3000, () => {
    console.info(`Server is running on port 3000`);
  });
}

start();
