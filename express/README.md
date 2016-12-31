![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]

### Installation
```
npm install @decorators/express --save
```

### API
#### Functions
* **bootstrapControllers(app: Express, [ controllers ])** - attach controllers to app

#### Decorators
##### Class
* @Controller(baseUrl: string)

##### Method
* @Middleware(middleware: Function | Function[]), middleware priority:
```typescript
class Controller {
  @Delete('/:id')
  @Middleware([FirstMiddleware, SecondMiddleware])  //<-- this will be executed first
  remove(@Request() req, @Response() res, @Params('id') id) {
  }
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
