![Node Decorators](../decorators.png?raw=true)

## Installation
```
npm install express --save
npm install @decorators/di --save
npm install @decorators/server --save
```

## Example
Fully working example can be found in [example](example) folder.

## Application
In order to create an application, use `Application` class with app root module:
```typescript
const app = await Application.create(AppModule);
```

Application instance provides an `inject` method to retrieve instances of any provided objects:
```typescript
const app = await Application.create(AppModule);
const module = await app.inject<HttpModule>(HttpModule);

module.use(json());

await module.listen(3000);
```

## Modules
* `HttpModule` - main module to start an application:
```typescript
import { Application, HttpModule, Module } from '@decorators/server';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
  ],
})
export class AppModule { }
```

## Adapters
* `ExpressAdapter` - adapter for [express](https://github.com/expressjs/express)

## Payload vaidation
Package supports [class-validator](https://github.com/typestack/class-validator) and [class-transformer](https://github.com/typestack/class-transformer) packages, basic types validation is supported as well:
```typescript
@Get(':id', 200)
post(@Params('id') id: string) {
  return { id };
}
```

## Pipes
Pipes allow to add additional "interceptors" before and after main route function.
In order to implement a pipe import `ProcessPipe` interface and implement it:

```typescript
import { HttpContext, PipeHandle, ProcessPipe } from '@decorators/server';

export class TransformPipe implements ProcessPipe {
  async run(context: HttpContext, handle: PipeHandle<string>) {
    const message = await handle();

    return message.toLocaleString();
  }
}
```

Add `@Pipe` decorator to the method or to entire controller:
```typescript
@Pipe(TransformPipe)
process(@Body() body: object)
```

Pipes can be used both for controller and methods.

## Injectables
Global server pipes can be applied by providing them via `GLOBAL_PIPE` injectable with `multi` (see [di](../di) package for details) flag:
```typescript
import { GLOBAL_PIPE, Module } from '@decorators/server';

@Module({
  providers: [
    {
      provide: GLOBAL_PIPE,
      useClass: ServerPipe,
      multi: true,
    },
  ],
})
export class AppModule { }
```

### App prefix
To create global application prefix (aka version, namespace) use `APP_VERSION` injectable:
```typescript
import { APP_VERSION, Module } from '@decorators/server';

@Module({
  providers: [
    {
      provide: APP_VERSION,
      useValue: 'v1',
    },
  ],
})
export class AppModule { }
```

## Dependency injection
This module supports dependency injection provided by `@decorators/di` package. For convinience, `@decorators/server` reexports all decorators from `@decorators/di` package.

## Decorators
### Class
* `@Module(options: ModuleOptions)` - Defines a module (namespace) for DI providers, controllers etc.
* `@Controller(url: string, options?: Record<string, unknown>)` - Registers controller for base url with optional options
* `@Pipe(pipe: ClassConstructor<ProcessPipe>)` - Registers a pipe for a controller

### Method
* `@Pipe(pipe: ClassConstructor<ProcessPipe>)` - Registers a pipe for a method

* `@Delete(url: string, status?: number)` - Registers delete route
* `@Get(url: string, status?: number)` - Registers get route
* `@Head(url: string, status?: number)` - Registers head route
* `@Options(url: string, status?: number)` - Registers options route
* `@Patch(url: string, status?: number)` - Registers patch route
* `@Post(url: string, status?: number)` - Registers post route
* `@Put(url: string, status?: number)` - Registers put route

* `@Render(template: string)` - Renders a template in the configured views folder
```typescript
const app = await Application.create(AppModule);
const module = await app.inject<HttpModule>(HttpModule);

module.set('views', join(__dirname, '/views'));
```

### Parameter
* `@Body(paramName?: string)` - Request body object or single body param
* `@Cookies(paramName?: string)` - Request cookies or single cookies param
* `@Headers(paramName?: string)` - Request headers object or single headers param
* `@Params(paramName?: string)` -  Request params object or single param
* `@Query(paramName?: string)` - Request query object or single query param
* `@Request(paramName?: string)` - Returns request object or any other object available in req object itself
* `@Response(paramName?: string)` - Returns response object or any other object available in response object itself

## Custom Decorators
Package exports two main helpers to create custom decorators:
* `Decorate` - allows to create custom class or method decorators
```typescript
import { Decorate } from '@decorators/server';
// ...
@Decorate('hasAccess', 'granted')
create() {}
```

To read custom metadata use `Reflector` injectable and its `getMeatada` method:
```typescript
@Injectable()
export class AccessPipe implements ProcessPipe {
  constructor(private reflector: Reflector) { }

  async run(context: HttpContext, handle: PipeHandle<string>) {
    const access = this.reflector.getMetadata('hasAccess', context.getHandler());
    const req = context.getRequest<Request>();

    if (access === req.query.access) {
      return handle();
    }

    throw new ApiError('unauthorized');
  }
}
```

* `createParamDecorator(factory: (context: Context) => any)` - allows to create custom parameter decorators
```typescript
import { createParamDecorator } from '@decorators/server';

function AccessParam() {
  return createParamDecorator((context: HttpContext) => {
    const req = context.getRequest<Request>();

    return req.query.access;
  });
}

// ...
create(@AccessParam() access: string) {}
```
