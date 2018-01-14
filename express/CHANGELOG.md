# 2.2.1
* Router support for `attachControllers` helper function
* Global error middleware also intercepts errors in async method handlers
* Changed library structure

# 2.2.0
* `@Injectable` from `@decorators/di` is now optional for controller.
Note: make sure to use `@Injectable` if you need dependency injection in controller
* Fixed passing incorrect error object to next handler in case if `ERROR_MIDDLEWARE` wasn't registered

# 2.1.0
* Fixed definitions
* Fixed complition for VSCode, etc.

# 2.0.0
* Dependency injection with `@decorators/di`, closes #54;
* Express route middlewares as a class, closes #55;
* Functions as middleware are no longer supported, use classes instead
* Single middleware are no longer supported, use array instead (unified interface for all usages)
* Added `All`, `Patch` and `Head` route decorators
* Global error middleware, closes #56
* Updated `express` version to `>=4.16.2`
* Removed deprecated methods and decorators
* big refactoring

# 1.3.0
* Moved express-related types to package interfaces
* `@Request(name?: string)` decorator accepts optional parameter name
* Controller DI

# 1.2.0
* Added controller-based middleware - `@Controller(baseUrl: string, [middleware]?)`
* moved route-based middleware to route definition decorator - `@Get(url: string, [middleware]?)`
* renamed `bootstrapControllers` to `attachControllers`
* `@Middleware` moved to deprecated, will be removed in 2.0.0
* `bootstrapControllers` moved to deprecated, will be removed in 2.0.0

# 1.1.1
* Added possibility to pass array of middleware funcs into `@Middleware`

# 1.1.0
* Automatic definitions generation
* removed helper functions
  * `bootstrapExpress`
  *  `bootstrapController`
  * `bootstrapControllersFromDirectory`

# 1.0.0
* Moved project to scoped packages
```
npm install @decorators/express --save
```

# 0.2.4
* Two new ways to register controller(s) - ```bootstrapController```, ```bootstrapControllers```
* Added missing typings for ```bootstrapControllersFromDirectory```

# 0.2.2
* Fixed typings and dev build configuration

# 0.2.1
* New express function `bootstrapControllersFromDirectory(app: Express, folder: string)` for reading folder with controllers

# 0.2.0
* moved project to `ES6`

# 0.1.4
* Fixed express decorators request method assignment

# 0.1.2
* @Next *express* decorator
* *express* route function usage without parameter decorators
```
@Get('/')
homeAction(req, res, next) {
  res.render('Home.twig');
}
```

# 0.1.1
* added trash files into `.npmignore`

# 0.1.0
* New imports:
```
import { Controller } from 'node-decorators/express';
```
  * Removed deprecated methods
    * `decorateExpressApp`
    * `App`

# 0.0.8
* ES6 support as target

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
