# node-decorators [1.0.0]
Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]

### Installation
```
npm install @decorators/express --save
```

### API

#### Functions
* **bootstrapExpress(express())** - Function will add additional method **controller()** to express application.
**app.controller()** returns app.
* **bootstrapController(app: Express, controller)** - attach controller to app
* **bootstrapControllers(app: Express, controllers)** - attach controllers to app
* **bootstrapControllersFromDirectory(app: Express, folder: string)** - read folder and attach controllers

#### Decorators
##### Class
* @Controller(baseUrl: string)
##### Method
* @Middleware(middleware: Function), middleware priority:
```
@Delete('/:id')
@Middleware(ThirdMiddleware)  //<-- this will be executed last
@Middleware(SecondMiddleware) //<-- this will be executed second
@Middleware(FirstMiddleware)  //<-- this will be executed first
remove(@Request() req, @Response() res, @Params('id') id) {
  //...
}
```
* @Get(url: string)
* @Post(url: string)
* @Put(url: string)
* @Delete(url: string)
* @Options(url: string)
##### Parameter
* @Request()
* @Response()
* @Next()
* @Params(name?: string)
* @Query(name?: string)
* @Body(name?: string)
* @Headers(name?: string)
* @Cookies(name?: string)

### Example Express Application and Controller:
```
import { Response, Params, Controller, Get,
  bootstrapExpress, Middleware
} from 'node-decorators/express';

@Controller('/')
class TestController {
  @Get('/all/:id')
  @Middleware((req, res, next) => {
    console.log('Hello World');
    next();
  })
  getData(@Response() res, @Params('id') id: string) {
    res.send(`balalala  ${id}`);
  }
}

let app: DecoratedExpress = <DecoratedExpress>express();
bootstrapExpress(app);
app.controller(TestController).listen(3000);
```

[ExpressJS]:http://expressjs.com
