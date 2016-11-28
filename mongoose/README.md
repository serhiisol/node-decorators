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
* **ref(collectionRef)** - helper function to define reference to another collection/model
* **ModelClass** - interface provides all properties and functions to the class

#### Decorators
##### Class
* @Model(name: string)

##### Method
* @Static()
* @Query()
* @Instance()
* @Virtual()

##### Property
* @SchemaField(schemaFieldDefinition)
* @Static()
* @Index()
* @Set() = @Option()

### Example Mongoose Model
```typescript
import {
  SchemaField, Model, bootstrapMongoose,
  Static, Instance
} from 'node-decorators/mongoose';

@Model('Test')
class TestModelClass {
  @SchemaField(String)
  testField: string;

  @Static()
  testMethod() {
  }

  @Instance()
  instanceMethod() {
  }
}

export let TestModel = bootstrapMongoose(TestModelClass);
```

[MongooseJS]:http://mongoosejs.com
