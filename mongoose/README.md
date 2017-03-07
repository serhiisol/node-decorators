![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [MongooseJS]

### Installation
```
npm install @decorators/mongoose --save
```

### API
#### Functions
* **bootstrapMongoose(MongooseModel || Injectable)** - Function to generate model for class, where Injectable:
```typescript
{ provide: MongooseModel, deps: [UserService] }
```
* **ref(collectionRef)** - helper function to define reference to another collection/model
* **ModelClass** - interface provides all properties and functions to the class

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

* **@Set()** = **@Option()** (*deprecated* Use options parameter of Model decorator instead)

### Example Mongoose Model
```typescript
@Model('Animal')
class Animal extends ModelClass {
  @SchemaField(String)
  name: string;

  @Static()
  spawn() {
  }

  @Instance()
  scream() {
  }

  @Query()
  byName(name: string): Promise<Animal> {
    return this.find({ name });
  }
}

export let TestModel = bootstrapMongoose(TestModelClass);
```

### License
MIT

[MongooseJS]:http://mongoosejs.com
