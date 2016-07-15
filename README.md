# node-decorators

## Example:
```
import { Request, Response, Param, Params, Controller, RouteGet, App, Middleware } from '@node-decorators';

@Controller('/')
class Test {

  @RouteGet('/all/:id')
  @Middleware((req, res, next) => {
    console.log('Hello World');
    next();
  })
  getData(@Response() res, @Request() req, @Param('id') id: string) {
    res.send(`balalala  ${id}`);
  }

}

let app = App();

app.controller(Test)
  .listen(3000);
```

## API
You have two options how to decorate express application:

### Express application wrapper

```
import {App} from '@node-decorators';
let app = App();
app.controller(ControllerClass);
```

### Decorate function

```
import * as express from 'express';
import {decorateExpressApp} from '@node-decorators';
let app = express();
decorateExpressApp(app)
app.controller(ControllerClass);
```

These two functions will add additional method **controller** to express application.
**app.controller** returns app.


### ClassDecorator
@Controller(baseUrl: string)

### MethodDecorators

@Get(url: string)
@Post(url: string)
@Put(url: string)
@Delete(url: string)
@Options(url: string)

@Middleware(middleware: Function)

### ParameterDecorators

@Request()

@Response()

@Params(name?: string)

@Query(name?: string)

@Body(name?: string)

@Headers(name?: string)

@Cookies(name?: string)


#### License
"you are allowed to use" a.k.a. MIT :)
