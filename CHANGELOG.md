# 1.0.0
### BREAKING CHANGES
* Moved project to scoped packages
```
npm install @decorators/co --save
npm install @decorators/express --save
npm install @decorators/mongoose --save
```

# 0.2.4
### Features
* Two new ways to register controller(s) - ```bootstrapController```, ```bootstrapControllers```
### Bug Fixes
* Added missing typings for ```bootstrapControllersFromDirectory```

# 0.2.3
### Bug Fixes
* Fixed context of the async decorator

# 0.2.2
### Bug Fixes
* Fixed typings and dev build configuration

# 0.2.1
### Features
* New express function **bootstrapControllersFromDirectory(app: Express, folder: string)** for reading folder with controllers

# 0.2.0
### Features
* New [Co] decorator @Async
### Breaking changes
* moved project to **ES6**

# 0.1.4
### Bug Fixes
* Fixed express decorators request method assignment

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
  * Class
    * @Schema(schemaDefinition: any)
    * @Model(name: string)

# 0.0.5
### Features
* Base express decorators
  * Class
    * @Controller(baseUrl: string)
  * Method
    * @Get(url: string)
    * @Post(url: string)
    * @Put(url: string)
    * @Delete(url: string)
    * @Options(url: string)
    * @Middleware(middleware: Function)
  * Parameter
    * @Request()
    * @Response()
    * @Params(name?: string)
    * @Query(name?: string)
    * @Body(name?: string)
    * @Headers(name?: string)
    * @Cookies(name?: string)
    
[Co]:https://github.com/tj/co