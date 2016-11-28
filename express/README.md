![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]

### Installation
```
npm install @decorators/express --save
```

### API
#### Functions
* **bootstrapControllers(app: Express, controllers)** - attach controllers to app

#### Decorators
##### Class
* @Controller(baseUrl: string)

##### Method
* @Middleware(middleware: Function), middleware priority:
```typescript
@Delete('/:id')
@Middleware(ThirdMiddleware)  //<-- this will be executed last
@Middleware(SecondMiddleware) //<-- this will be executed second
@Middleware(FirstMiddleware)  //<-- this will be executed first
remove(@Request() req, @Response() res, @Params('id') id) {
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
```typescript
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

### License
MIT

[ExpressJS]:http://expressjs.com
