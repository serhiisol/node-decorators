![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

## Installation
Main dependencies
```
npm install @decorators/server @decorators/di --save
```
Adapter specific imports
```
npm install express body-parser --save
```
Or
```
npm install fastify @fastify/cookie @fastify/static @fastify/view --save
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
import { Application, Module } from '@decorators/server';
import { HttpModule } from '@decorators/server/http';

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
import { PipeHandle, ProcessPipe } from '@decorators/server';
import { HttpContext } from '@decorators/server/http';

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
  * `options?.ignoreVersion` - ignore global version prefix (provided `APP_VERSION`), can be useful to setup global handlers, such as 404 handling
* `@Pipe(pipe: ClassConstructor<ProcessPipe>)` - Registers a pipe for a controller

### Method
* `@Pipe(pipe: ClassConstructor<ProcessPipe>)` - Registers a pipe for a method

#### @decorators/server/http
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
* `@Body(paramName?: string, paramValidator?: Validator)` - Request body object or single body param
* `@Cookies(paramName?: string, paramValidator?: Validator)` - Request cookies or single cookies param
* `@Headers(paramName?: string, paramValidator?: Validator)` - Request headers object or single headers param
* `@Params(paramName?: string, paramValidator?: Validator)` -  Request params object or single param
* `@Query(paramName?: string, paramValidator?: Validator)` - Request query object or single query param
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

# Swagger
Swagger decorators are available in
```typescript
import { SwaggerModule } from '@decorators/server/swagger';
```

To start with swagger decorators provide `SwaggerModule` in the `AppModule`, for example:

```typescript
import { SwaggerModule } from '@decorators/server/swagger';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    SwaggerModule.forRoot({
      description: 'Decorators Example App',
      title: '@decorators/server',
    }),
    ...
  ],
})
export class AppModule { }
```

## Decorators
### Method
* `@ApiOperation(operation: OpenAPIV3_1.OperationObject)` - Registers an operation
* `@ApiResponse(description: string, type?: ClassConstructor)` - Registers simple response for a method. This decorator uses status provided by the route decorator, e.g. `@Get(route, status)`.
* `@ApiResponseSchema(responses: ApiResponses)` - Registers a response for a method. This method accepts more complex types of responses, if method returns more than one.
* `@ApiBearerAuth()` - Defines a bearer authentication method for a route
* `@ApiSecurity(security: OpenAPIV3_1.SecuritySchemeObject)` - Defines more complex authentication methods for a route.

### Property
* `@ApiParameter(parammeter: { description?: string })` - Specifies a description for a property defined in the class-decorator based classes

