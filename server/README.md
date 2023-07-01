![Node Decorators](../decorators.png?raw=true)

## Installation
```
npm install @decorators/server --save
```

## Quick example
```typescript
import { Application, HttpModule, APP_VERSION, GLOBAL_PIPE, Module } from '@decorators/server';
import { ExpressAdapter } from '@decorators/server/express';
import { json } from 'body-parser';

import { PostsModule, UsersModule } from './modules';
import { ServerPipe } from './pipes';
import { ServicesModule } from './services';

@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    UsersModule,
    PostsModule,
    ServicesModule,
  ],
  providers: [
    {
      provide: APP_VERSION,
      useValue: 'v1',
    },
    {
      provide: GLOBAL_PIPE,
      useClass: ServerPipe,
      multi: true,
    },
  ],
})
class AppModule { }

async function bootstrap() {
  const app = await Application.create(AppModule);
  const module = await app.inject<HttpModule>(HttpModule);

  module.use(json());

  await module.listen(3000);
  console.info('Server is running on port 3000');
}

bootstrap().catch(console.error);
```
Fully working example can be found in [example](example) folder.

## API
## Application
In order to create an application, use **Application** class with app root module.
```typescript
const app = await Application.create(AppModule);
```

Application instance provides an `inject` method to be able to retrieve instances of any provided objects.
```typescript
const app = await Application.create(AppModule);
const module = await app.inject<HttpModule>(HttpModule);

module.use(json());

await module.listen(3000);
```

### Modules
* **HttpModule** - main module to start entire application, registers custom middlewares, params
```typescript
import { Application, HttpModule, Module } from '@decorators/server';
// ...
@Module({
  modules: [
    HttpModule.create(ExpressAdapter),
    // ...
  ],
})
class AppModule { }
// ...

async function bootstrap() {
  const app = await Application.create(AppModule);
  const module = await app.inject<HttpModule>(HttpModule);

  module.use(json());

  await module.listen(3000);
}
```

### Decorators
#### Class
* **@Module(options: ModuleOptions)** - Defines a module (namespace) for DI providers, controllers etc.
* **@Controller(url: string, options?: Record<string, unknown>)** - Registers controller for base url with optional options
* **@Pipe(pipe: ClassConstructor<ProcessPipe>)** - Registers a pipe for a controller

#### Method
* **@Pipe(pipe: ClassConstructor<ProcessPipe>)** - Registers a pipe for a method

* **@Delete(url: string, status?: number)** - Registers delete route
* **@Get(url: string, status?: number)** - Registers get route
* **@Head(url: string, status?: number)** - Registers head route
* **@Options(url: string, status?: number)** - Registers options route
* **@Patch(url: string, status?: number)** - Registers patch route
* **@Post(url: string, status?: number)** - Registers post route
* **@Put(url: string, status?: number)** - Registers put route

* **@Render(template: string)** - Renders a template in the configured views folder
```typescript
const app = await Application.create(AppModule);
const module = await app.inject<HttpModule>(HttpModule);

module.set('views', join(__dirname, '/views'));
```

#### Parameter
* **@Body(paramName?: string)** - Request body object or single body param
* **@Cookies(paramName?: string)** - Request cookies or single cookies param
* **@Headers(paramName?: string)** - Request headers object or single headers param
* **@Params(paramName?: string)** -  Request params object or single param
* **@Query(paramName?: string)** - Request query object or single query param
* **@Request(paramName?: string)** - Returns request object or any other object available in req object itself
* **@Response(paramName?: string)** - Returns response object or any other object available in response object itself

### Pipes
Pipes allow to add additional interceptors before and after main route function.
In order to implement a pipe import `ProcessPipe` interface and implement it like so:

```typescript
import { HttpContext, PipeHandle, ProcessPipe } from '@decorators/server';

export class QuestionPipe implements ProcessPipe {
  async run(_context: HttpContext, handle: PipeHandle<string>) {
    const message = await handle();

    return `??${message}??`;
  }
}
```

And then apply pipe using **@Pipe** decorator:
```typescript
@Pipe()
process(@Body() body: object)
```

Pipes can be used both for controller and methods.

### Injectables
Global server pipes can be applied by providing them via **GLOBAL_PIPE** injectable:
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

#### App prefix
To create global application prefix (aka version, namespace) use **APP_VERSION** injectable:
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

#### Dependency injection
This module supports dependency injection provided by `@decorators/di` module. For convinience, `@decorators/server` reexports all decorators from `@decorators/di` package.
