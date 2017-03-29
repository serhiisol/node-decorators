# Mongoose#2.0.0
### FEATURES
* **schema()** helper function added in order to reach mongoose schema in the same way, with @decorators/mongoose class

### BREAKING CHANGES
* removed deprecated **@Set()** = **@Option()**
* renamed **bootstrapMongoose** to **model(...)**
* renamed **ModelClass**

# Mongoose#1.2.1
* Fixed model ctx for DI

# Mongoose#1.2.0
* Model DI

# Mongoose#1.1.2
* New `options` parameter for `Model` decorator to pass in Schema Type options
* `Set` and `Option` decorators are now deprecated and will be removed in a future release 

# Mongoose#1.1.1
* Automatic definitions generation
* new **ref(collectionRef)** - helper function to define reference to another collection/model
* **ModelClass** interface provides all properties and functions to the class

# Mongoose#1.1.0
### BREAKING CHANGES
* Changed **@Schema** decorator to **@SchemaField** to use it inside class as property decorator
  ```typescript
  @Model('User')
  class User {
    @SchemaField(String)
    firstName: string;
  }
  ```
* Each decorator should be used with parentheses
  ```typescript
  class User {
  @Virtual()
    get password() {
      return 'password';
    }
  }
  ```
* Updated mongoose to 4.7.0


# 1.0.0
### BREAKING CHANGES
* Moved project to scoped packages
```
npm install @decorators/co --save
npm install @decorators/express --save
npm install @decorators/mongoose --save
```

# 0.2.2
### Bug Fixes
* Fixed typings and dev build configuration

# 0.2.0
### Breaking changes
* moved project to **ES6**

# 0.1.1
### Bug Fixes
* added trash files into **.npmignore**

# 0.1.0 
### Features
* New mongoose decorators
  * @Static
  * @Query
  * @Instance
  * @Virtual
  * @Index
  * @Set = @Option

# 0.0.8
### Features
* ES6 support as target

# 0.0.6
### Features
* Base mongoose decorators
  * Class
    * @Schema(schemaDefinition: any)
    * @Model(name: string)
