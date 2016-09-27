![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [MongooseJS]

### Installation
```
npm install @decorators/mongoose --save
```

### API
#### Functions
* **bootstrapMongoose(MongooseModel)** - Function to generate model for class.

#### Decorators
##### Class
* @Schema(schemaDefinition: any)
* @Model(name: string)

##### Method
* @Static
* @Query
* @Instance
* @Virtual

##### Property
* @Static
* @Index
* @Set = @Option

### Example Mongoose Model
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

[MongooseJS]:http://mongoosejs.com
