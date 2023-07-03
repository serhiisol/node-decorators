![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

## Installation
```
npm install @decorators/di --save
```

## Example
Fully working example can be found in [example](example) folder.

## API
* `@Injectable()` - Registers class as provider in the container
```typescript
@Injectable()
class HttpService {}
```

* `@Inject(injectable: Injectable)` - A parameter decorator that marks parameter as dependency.
```typescript
@Injectable()
class HttpService {
  constructor(@Inject(API_URL) apiUrl: string) {}
}
```

* `@Optional()` - A parameter decorator that marks parameter as optional dependency.
```typescript
@Injectable()
class HttpService {
  constructor(@Optional() @Inject(API_URL) apiUrl: string) {}
}
```

* `InjectionToken` - Creates a token that can be used in DI as Provider.
```typescript
const API_URL = new InjectionToken('API_URL');
...
@Injectable()
class HttpService {
  constructor(@Inject(API_URL) apiUrl: string) {}
}
```

* `Container` - Container interface
  * `.setParent(container: Container)` - set parent container
  * `.provide(providers: Providers[])` - Registers an array of providers.
  * `.get<T>(injectable: Injectable): Promise<T>` - Retrieves a Promise with an instance of the injectable, throws:
    * `MissingProviderError` if dependency provider wasn't found
    * `RecursiveProviderError` in case of recursive dependency injection
```typescript
const container = new Container();

container.provide([
  {
    provide: 'Message',
    async useFactory() {
      return delay('Async Provider');
    },
  },
  {
    provide: 'Hello World',
    useClass: Service,
  },
]);
```

## Multi-support
It's possible to provide multiple things using one injection token via `multi` flag:
```typescript
container.provide([
  {
    provide: GLOBAL_PIPE,
    useClass: ServerPipe,
    multi: true
  },
  {
    provide: GLOBAL_PIPE,
    useClass: ErrorPipe,
    multi: true
  },
]);
```
