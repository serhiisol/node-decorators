![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]

### Installation
```
npm install @decorators/express --save
```

### API
#### Functions
* **attachControllers(app: Express, controllers)** - attach controllers to express application

#### Decorators
##### Class
* **@Controller(baseUrl: string, [middleware]?)** - Registers controller for base url

##### Method
* **@Get(url: string, [middleware]?)** - Registers get route for url with route middleware, if specified
* **@Post(url: string, [middleware]?)** - Registers post route for url with route middleware, if specified
* **@Put(url: string, [middleware]?)** - Registers put route for url with route middleware, if specified
* **@Delete(url: string, [middleware]?)** - Registers delete route for url with route middleware, if specified
* **@Options(url: string, [middleware]?)** - Registers options route for url with route middleware, if specified
* **@Route(url: string, [middleware]?)** - Registers custom type route for url with route middleware, if specified

where middleware is:

```typescript
interface RequestHandler {
    (req: Request, res: Response, next: NextFunction): any;
}
```

or

```typescript
export abstract class Middleware {
  public abstract use(request: Request, response: Response, next: NextFunction): void;
}
```

To use class, import `Middleware` interface and implement it, like so:
```typescript
import { Middleware } from '@decorators/express';

export class UserMiddleware implements Middleware {
  public use(request: Request, response: Response, next: NextFunction) {
    next();
  }
}
```

##### Parameter
* **@Request(name?: string)** - Returns express req object or any other object, if name was specified
* **@Response()** - Returns express res object
* **@Next()** - Returns express next function
* **@Params(name?: string)** - Express req.params object or single param, if param name was specified
* **@Query(name?: string)** - Express req.query object or single query param, if query param name was specified
* **@Body(name?: string)** - Express req.body object or single body param, if body param name was specified
* **@Headers(name?: string)** - Express req.headers object or single headers param, if headers param name was specified
* **@Cookies(name?: string)** - Express req.body object or single cookies param, if cookies param name was specified

#### Dependency injection
This module supports dependency injection provided by `@decorators/di` module. For example, see the full example below.

### Example Express Application and Controller:
```typescript
import {
  Response, Params, Controller, Get,
  attachControllers, Middleware
} from '@decorators/express';

@Controller('/')
class UsersController {

  constructor(userService: UserService) {}

  @Get('/users/:id')
  getData(@Response() res, @Params('id') id: string) {
    res.send(userService.findById(id));
  }
}

let app = express();
attachControllers(app, [UsersController]);
app.listen(3000);
```

[ExpressJS]:http://expressjs.com
