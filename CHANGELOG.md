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
