# Socket#1.2.0
### BREAKING CHANGES
* Updated Socket.io version to **1.6.0**
* Removed **attachController** for the sake of **attachControllers**
* **bootstrapSocketIO** now accepts io server instance as first argument and array of controllers as second
### Features
* New **@Controller(namespace: string)** decorator, registers namespace for sockets
* **attachControllerToSocket(io: SocketIO.Server, socket: SocketIO.Socket, Controllers)** -  Attaches controllers to Socket

# Socket#1.1.2
### BREAKING CHANGES
* Moved server configuration out of **@Connect** decorator to **bootstrapSocketIO**
  ```
  bootstrapSocketIO(httpServerInstance || 3000)
  ```
* Removed  **@Connect** decorator
### Features
* **attachControllers** attach array of controllers

# Socket#1.1.1
### Features
* new socket.io decorator
  ##### Method
    * **@OnDisconnect()**
* **SocketIOServer** interface added
### Bug fixes
  * **attachController** will now return correct object (SocketIOServer, this)

# Socket#1.1.0
### Features
* New socket.io decorators
  #### Functions
  * **bootstrapSocketIO(rootController: Controller)**
  ##### Class
  * **@Connect(serverOrPort: number | string | HttpServer, opts?: any)**
  * **@Middleware(fn: Function)** 
  ##### Method
  * **@OnIO(event: string)**
  * **@OnConnect()**
  * **@OnConnection()**
  * **@OnSocket(event: string)**
  ##### Parameter
  * **@IO()**
  * **@Socket()**
  * **@Args()**
  * **@Callback()**

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
