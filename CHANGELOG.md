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
