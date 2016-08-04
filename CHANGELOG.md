# 0.1.2
### Features
* @Next *express* decorator

### Bug Fixes
* *express* route function usage without parameter decorators
```
@Get('/')
homeAction(req, res, next) {
  res.render('Home.twig');
}
```

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

### BREAKING CHANGES
  * New imports:
```
import { Controller } from 'node-decorators/express';
import { Model } from 'node-decorators/mongoose';
```
  * Removed deprecated methods
    * **decorateExpressApp**
    * **App**

# 0.0.8
### Features
* ES6 support as target

# 0.0.6
### Features
* Base mongoose decorators

# 0.0.5
### Features
* Base express decorators
