![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [ExpressJS]
- [MongooseJS]
- [Co]
- [Socket.IO]

## Installation

```
npm install @decorators/co --save
npm install @decorators/express --save
npm install @decorators/mongoose --save
npm install @decorators/socket --save
```

## Example of usage
Here's example of usage with Express framework. It uses TypeScript and `@decorators/express` package

```typescript
import {
  Response, Params, Controller, Get,
  bootstrapControllers, Middleware
} from '@decorators/express';

@Controller('/')
class UsersController {
  @Get('/users/:id')
  @Middleware((req, res, next) => {
    console.log('route middleware');
    next();
  })
  getData(@Response() res, @Params('id') id: string) {
    res.send(Users.findById(id));
  }
}

let app = express();
bootstrapControllers(app, [UsersController]);
app.listen(3000);
```

## Documentation
Look at the corresponding package for instructions

[ExpressJS]:http://expressjs.com
[MongooseJS]:http://mongoosejs.com
[Co]:https://github.com/tj/co
[Socket.IO]:http://socket.io/
