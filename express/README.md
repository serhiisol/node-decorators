![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]

### Installation
```
npm install @decorators/express --save
```

### API
#### Functions
* **attachControllers(app: Express.Application | Express.Router, controllers: Controller[])** - attach controllers to express application
* **attachControllerInstances(app: Express.Application | Express.Router, controllers: Controller[])** - attach already existing instances of controllers

#### Decorators
##### Class
* **@Controller(baseUrl: string, middleware?: Middleware[])**, **@Controller(baseUrl: string, routerOptions: RouterOptions, middleware?: Middleware[])** - Registers controller for base url

##### Method
* **@All(url: string, middleware?: Middleware[])** - Registers all routes
* **@Get(url: string, middleware?: Middleware[])** - Registers get route
* **@Post(url: string, middleware?: Middleware[])** - Registers post route
* **@Put(url: string, middleware?: Middleware[])** - Registers put route
* **@Delete(url: string, middleware?: Middleware[])** - Registers delete route
* **@Patch(url: string, middleware?: Middleware[])** - Registers patch route
* **@Options(url: string, middleware?: Middleware[])** - Registers options route
* **@Head(url: string, middleware?: Middleware[])** - Registers head route
* **@Status(code: number)** - Specifies status code for the route

where middleware is the class that implements `Middleware` interface.

To use class, import `Middleware` interface and implement it, like so:
```typescript
import { Middleware } from '@decorators/express';

class UserMiddleware implements Middleware {
  public use(request: Request, response: Response, next: NextFunction): void {
    next();
  }
}
```

or a simple function

```typescript
function userMiddleware(request: Request, response: Response, next: NextFunction): void {
  next();
}
```

##### Parameter
* **@Request(property?: string)** (alias **@Req(property?: string)**) - Returns express req object or any other object, if name was specified
* **@Response()** (alias **@Res**) - Returns express res object
* **@Next()** - Returns express next function
* **@Params(param?: string)** - Express req.params object or single param, if param name was specified
* **@Query(param?: string)** - Express req.query object or single query param, if query param name was specified
* **@Body(param?: string)** - Express req.body object or single body param, if body param name was specified
* **@Headers(property?: string)** - Express req.headers object or single headers param, if headers param name was specified
* **@Cookies(param?: string)** - Express req.body object or single cookies param, if cookies param name was specified

#### Error middleware
To add error middleware, that handles unhandled errors simply implement `ErrorMiddleware` interface and provide it using `ERROR_MIDDLEWARE` token, like so:

```typescript
import { ErrorMiddleware, ERROR_MIDDLEWARE } from '@decorators/express';

@Injectable()
class ServerErrorMiddleware implements ErrorMiddleware {
  public use(error: Error, request: Request, response: Response, next: NextFunction) {
    next();
  }
}

Container.provide([
  { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware }
]);
```

or as a function

```typescript
import { ERROR_MIDDLEWARE } from '@decorators/express';

function serverErrorMiddleware(error: Error, request: Request, response: Response, next: NextFunction) {
  next();
}

Container.provide([
  { provide: ERROR_MIDDLEWARE, useValue: serverErrorMiddleware }
]);
```

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

  constructor(private userService: UserService) {}

  @Get('/users/:id')
  getData(@Response() res, @Params('id') id: string) {
    res.send(this.userService.findById(id));
  }
}

let app = express();
attachControllers(app, [UsersController]);

app.listen(3000);
```

You can also attach controllers to express.Router instance. This is useful when you want to namespace all of the routes with a prefix:

```
import { attachControllers } from '@decorators/express';

const apiRouter = express.Router();
attachControllers(apiRouter, [UsersController]);

app.use('/v1/api', apiRouter);
```


You can also use custom decorators as middleware :

Custom Decorator
```typescript
import { attachMiddleware } from "@decorators/express";
import {Request,Response,NextFunction} from '@decorators/express/node_modules/express';

export function Access(key: string) {
    return function (target: any,propertyKey: string,descriptor: PropertyDescriptor) {
      attachMiddleware(target,propertyKey,(req : Request,res : Response,next : NextFunction)=>{
            if(["CAN_ACCESS_TEST","CAN_ACCESS_HOME"].includes(key)){
              next();
            }else{
              res.send("ACCESS DENIED");
            }
        })
    };
  }

```


Controller Code 

```typescript
@Controller("/")
export class MainController {

    @Access("CAN_ACCESS_TEST")
    @Get("/test")
    getB() {
        return "You can access the test";
    }

    @Access("CAN_ACCESS_HOME")
    @Get("/home")
    getB() {
        return "You can access the home";
    }
}

```

*Note:-*``` Please use custom decorators before express decorators otherwise system will not detect any controller metadata and your decorator will not invoked.```

Will work:
```typescript
    @Access("CAN_ACCESS_TEST")
    @Get("/test")
    getB() {
        return "You can access the test";
    }
```
Will not work:
```typescript
    @Get("/test")
    @Access("CAN_ACCESS_TEST")
    getB() {
        return "You can access the test";
    }
```


[ExpressJS]:http://expressjs.com
