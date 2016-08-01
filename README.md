# node-decorators

This project implements decorators for modern tools for NodeJS like:
- [ExpressJS]
- [MongooseJS]

## Example Express Application and Controller:
```
import {
  Response,
  Params,
  Controller,
  Get,
  bootstrapExpress,
  Middleware
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

## Example Mongoose Model
```
import {connect, Document, Model as IModel } from 'mongoose';
import {Schema, Model, bootstrapMongoose} from 'node-decorators/mongoose';

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
  static testMethod() {
    console.log('static test method')
  }
  
  instanceMethod() {
    console.log(this);
  }
}
interface ITestModel {
  testField: string;
}
interface ITestModelType extends ITestModel, Document {
  instanceMethod(): void;
}
export let TestModel: IModel<ITestModelType> = bootstrapMongoose<ITestModelType>(TestModelClass);

```

## API

### Functions

bootstrapMongoose\<T extends Document\>(MongooseModel): IModel\<T\> -
Use this function to generate model for class.

bootstrapExpress\<T extends Document\>(MongooseModel): IModel\<T\> - 
This function will add additional method **controller** to express application.
**app.controller** returns app.

## Express

### Class
@Controller(baseUrl: string)

### Method
@Get(url: string)

@Post(url: string)

@Put(url: string)

@Delete(url: string)

@Options(url: string)

@Middleware(middleware: Function)

### Parameter
@Request()

@Response()

@Params(name?: string)

@Query(name?: string)

@Body(name?: string)

@Headers(name?: string)

@Cookies(name?: string)

## Mongoose

### Class
@Schema(schemaDefinition: any)

@Model(name: string)

### Method

@Static

@Query

@Instance

@Virtual

### Property

@Static

@Index

@Set = @Option


#### [Change Log]

#### [License]

[ExpressJS]:http://expressjs.com
[MongooseJS]:http://mongoosejs.com
[Change Log]:/CHANGELOG.md
[License]:/LICENSE.md
