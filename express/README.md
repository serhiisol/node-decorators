![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]

### Installation
```
npm install @decorators/express --save
```

### API
#### Functions
* **attachControllers(app: Express, [ controllers ])** - attach controllers to express application
* **bootstrapControllers(app: Express, [ controllers ])** - attach controllers to express application - **_[deprecated, use attachControllers - will be removed in v2.0.0 of this library]_**

#### Decorators
##### Class
* **@Controller(baseUrl: string, [middleware]?)** - Registers controller for base url

##### Method
* **@Middleware(middleware: Function | Function[])** - Registers route-based middleware - **_[deprecated, use route middleware - will be removed in v2.0.0 of this library]_**
```typescript
class Controller {
  @Delete('/:id')
  @Middleware([FirstMiddleware, SecondMiddleware])
  remove(@Request() req, @Response() res, @Params('id') id) {
  }
}
```

* **@Get(url: string, [middleware]?)** - Registers get route for url with route middleware, if specified
* **@Post(url: string, [middleware]?)** - Registers post route for url with route middleware, if specified
* **@Put(url: string, [middleware]?)** - Registers put route for url with route middleware, if specified
* **@Delete(url: string, [middleware]?)** - Registers delete route for url with route middleware, if specified
* **@Options(url: string, [middleware]?)** - Registers options route for url with route middleware, if specified
* **@Route(url: string, [middleware]?)** - Registers custom type route for url with route middleware, if specified

##### Parameter
* **@Request()** - Returns express req object
* **@Response()** - Returns express res object
* **@Next()** - Returns express next function
* **@Params(name?: string)** - Express req.params object or single param, if param name was specified
* **@Query(name?: string)** - Express req.query object or single query param, if query param name was specified
* **@Body(name?: string)** - Express req.body object or single body param, if body param name was specified
* **@Headers(name?: string)** - Express req.headers object or single headers param, if headers param name was specified
* **@Cookies(name?: string)** - Express req.body object or single cookies param, if cookies param name was specified

### Example Express Application and Controller:
```typescript
import {
  Response, Params, Controller, Get,
  bootstrapControllers, Middleware
} from '@decorators/express';

@Controller('/')
class UsersController {
  @Get('/users/:id')
  @Middleware((req, res, next) => {
    console.log('route middleware');
    next();
  })
  getData(@Response() res, @Params('id') id: string) {
    res.send(Users.findById(id));
  }
}

let app = express();
bootstrapControllers(app, [UsersController]);
app.listen(3000);
```

### License
MIT

[ExpressJS]:http://expressjs.com
