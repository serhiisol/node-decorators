![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [MongooseJS]

### Installation
```
npm install @decorators/mongoose --save
```

### API
#### Functions
* **model(class: MongooseClass)** - Helper function to generate model for class
* **schema(class: MongooseClass)** - Helper function to generate plain schema
* **ref(collectionRef: string)** - Helper function to define reference to another collection/model

#### Decorators

##### Class
* **@Model(name: string, options?: SchemaTypeOpts)** - registers model with defined name and options

##### Method
* **@Static()** - registers static method (on static member)
* **@Query()** - registers query
* **@Instance()** - registers instance method
* **@Virtual()** - registers virtual property
* **@Hook(hookType: string, actionType: string)** - define mongoose lifecycle hook, where:
  * **hookType** = `pre` | `post` | etc.
  * **actionType** = `save` | `find` | etc.
  * for all other hooks you can check [MongooseJS] website

##### Property
* **@SchemaField(options: schemaFieldDefinition)** - registers schema field
* **@Static()** - registers static property
* **@Index()** - registers index property

### Example Mongoose Model
> Note: In order to get access to all proper methods, you have to extend mongoose Document in your class interface, like so:

```typescript
import { Document } from 'mongoose';

@Model('Animal')
class Animal {
  @SchemaField(String)
  name: string;

  @Static()
  static spawn() {}

  @Instance()
  scream() {}

  @Query()
  byName(name: string): Promise<Animal> {
    return this.find({ name });
  }
}
interface Animal extends Document{}


export const AnimalModel: AnimalType = model(Animal);

// This type is also necessary to have all needed methods and properties of mongoose
// plus all static methods and properties of Animal class
type AnimalType = mongoose.Model<Animal> & typeof Animal;
```

[MongooseJS]:http://mongoosejs.com
