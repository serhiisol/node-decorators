![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [MongooseJS]

### Installation
```
npm install @decorators/mongoose --save
```

### API
#### Functions
* **model(MongooseModel | { provide: MongooseModel, deps: [UserService] })** - Helper function to generate model for class
* **schema(MongooseModel | { provide: MongooseModel, deps: [UserService] })** - Helper function to generate plain schema
* **ref(collectionRef)** - Helper function to define reference to another collection/model

#### Decorators

##### Class
* **@Model(name: string, options?: SchemaTypeOpts)** - registers model with defined name and options

##### Method
* **@Static()** - registers static method
* **@Query()** - registers query
* **@Instance()** - registers instance method 
* **@Virtual()** - registers virtual property

##### Property
* **@SchemaField(schemaFieldDefinition)** - registers schema field
* **@Static()** - registers static property
* **@Index()** - registers index property

### Example Mongoose Model
> Note: In order to get access to all proper methods, you can create custom **AbstractModel** like so:
```typescript
import { MongooseDocument, Model, Document } from 'mongoose';

export interface AbstractModel extends MongooseDocument {
  __v?: number;
  update(data: any);
  increment?(): this;
  model?(name: string): Model<Document>;
  remove?(fn?: (err: any, product: this) => void): Promise<this>;
  save?(fn?: (err: any, product: this, numAffected: number) => void): Promise<this>;
}

export abstract class AbstractModel {}
```

```typescript
@Model('Animal')
class Animal extends AbstractModel {
  @SchemaField(String)
  name: string;

  @Static()
  spawn() {}

  @Instance()
  scream() {}

  @Query()
  byName(name: string): Promise<Animal> {
    return this.find({ name });
  }
}

export let TestModel = model(TestModelClass);
```

### License
MIT

[MongooseJS]:http://mongoosejs.com
