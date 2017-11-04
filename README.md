![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like 
[ExpressJS], [MongooseJS], [Socket.IO]

## Installation

```
npm install @decorators/di --save
npm install @decorators/express --save
npm install @decorators/mongoose --save
npm install @decorators/socket --save
npm install @decorators/common --save
```

## Example of usage
Here's example of usage with Express framework. It uses TypeScript and `@decorators/express` package

```typescript
import { Response, Params, Controller, Get, attachControllers } from '@decorators/express';
import { Injectable } from '@decorators/di';

@Controller('/')
@Injectable()
class UsersController {

  constructor(userService: UserService) {}

  @Get('/users/:id')
  getData(@Response() res, @Params('id') id: string) {
    res.send(this.userService.findById(id));
  }
}

let app: Express = express();

attachControllers(app, [UsersController]);

app.listen(3000);
```

## Documentation
Look at the corresponding package for instructions

[ExpressJS]:http://expressjs.com
[MongooseJS]:http://mongoosejs.com
[Socket.IO]:http://socket.io/
