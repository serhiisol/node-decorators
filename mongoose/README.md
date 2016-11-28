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
* @Model(name: string)

##### Method
* @Static
* @Query
* @Instance
* @Virtual

##### Property
* @SchemaField(schemaFieldDefinition)
* @Static
* @Index
* @Set = @Option

### Example Mongoose Model
```
import {connect, Document, Model as IModel } from 'mongoose';
import {
  SchemaField, Model, bootstrapMongoose,
  Static, Instance
} from 'node-decorators/mongoose';

connect('192.168.99.100:27017/test', {
  "server": {
    "socketOptions": {
      "keepAlive": 1
    }
  }
});

@Model('Test')
class TestModelClass {
  @SchemaField(String)
  testField: string;

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
