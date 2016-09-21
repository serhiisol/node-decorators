# node-decorators [0.2.4]
Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]
- [MongooseJS]
- [Co]

## Quick Examples
#### Example Express Application and Controller:
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

#### Example Mongoose Model
```
import {connect, Document, Model as IModel } from 'mongoose';
import {
  Schema, Model, bootstrapMongoose,
  Static, Instance
} from 'node-decorators/mongoose';

connect('192.168.99.100:27017/test', {
  "server": {
    "socketOptions": {
      "keepAlive": 1
    }
  }
});

@Schema({
  testField: String
})
@Model('Test')
class TestModelClass {
  @Static
  testMethod() {
    console.log('static test method')
  }
  @Instance
  instanceMethod() {
    console.log(this);
  }
}

export let TestModel = bootstrapMongoose(TestModelClass);
```

#### Example Co (Async)
```
...
import { Async } from 'node-decorators/co';

let testAsyncFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('testAsyncFunc');
      resolve()
    }, 3000);
  });
};

@Controller('/')
class TestController {
  @Get('/')
  @Async
  *getData(@Response() res) {
    console.log('code before async function');
    yield testAsyncFunc();
    console.log('code after async function');
    res.send('Success');
  }
}

let app: any = bootstrapExpress(express());
app.controller(TestController).listen(3003);
```

## API

#### Functions
bootstrapExpress(Express()) - Function will add additional method **controller()** to express application.
**app.controller()** returns app.

bootstrapController(app: Express, controller) - attach controller to app

bootstrapControllers(app: Express, controllers) - attach controllers to app

bootstrapControllersFromDirectory(app: Express, folder: string) - read folder and attach controllers

bootstrapMongoose(MongooseModel) - Function to generate model for class.

#### Decorators

##### Express
###### Class
* @Controller(baseUrl: string)
###### Method
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
###### Parameter
* @Request()
* @Response()
* @Next()
* @Params(name?: string)
* @Query(name?: string)
* @Body(name?: string)
* @Headers(name?: string)
* @Cookies(name?: string)

##### Mongoose
###### Class
* @Schema(schemaDefinition: any)
* @Model(name: string)
###### Method
* @Static
* @Query
* @Instance
* @Virtual
###### Property
* @Static
* @Index
* @Set = @Option

##### Co
###### Method
* @Async

[ExpressJS]:http://expressjs.com
[MongooseJS]:http://mongoosejs.com
[Co]:https://github.com/tj/co
