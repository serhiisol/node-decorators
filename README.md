![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]
- [MongooseJS]
- [Co]

## Installation

```
npm install @decorators/co --save
npm install @decorators/express --save
npm install @decorators/mongoose --save
```

## Quick Examples
#### Example Express Application and Controller:
```
import { Response, Params, Controller, Get,
  bootstrapExpress, Middleware
} from '@decorators/express';

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
} from '@decorators/mongoose';

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
import { Async } from '@decorators/co';
...
let testAsyncFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('testAsyncFunc');
      resolve()
    }, 3000);
  });
};
...
class TestController {
  @Async
  *getData() {
    console.log('code before async function');
    yield testAsyncFunc();
    console.log('code after async function');
  }
}

...
```


[ExpressJS]:http://expressjs.com
[MongooseJS]:http://mongoosejs.com
[Co]:https://github.com/tj/co
