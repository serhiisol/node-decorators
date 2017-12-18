![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

### Dependency Injection module for node-decorators project

### Installation
```
npm install @decorators/di --save
```
### API

* **@Injectable()** - Registers class as provider in the container (no need to provide it via **Container.provide**)
```typescript
@Injectable()
class HttpService {}
```

* **@Inject(injectable: Injectable)** - A parameter decorator that marks parameter as dependency.
```typescript
@Injectable()
class HttpService {
  constructor(@Inject(API_URL) apiUrl: string) {}
}
```

* **@Optional()** - A parameter decorator that marks parameter as optional dependency.
```typescript
@Injectable()
class HttpService {
  constructor(@Optional() @Inject(API_URL) apiUrl: string) {}
}
```

* **InjectionToken** - Creates a token that can be used in DI as Provider.
```typescript
const API_URL = new InjectionToken('API_URL');
...
@Injectable()
class HttpService {
  constructor(@Inject(API_URL) apiUrl: string) {}
}
```

* **Container** - Container interface
  * **.provide(providers: Providers[])** - Registers an array of providers.
  * **.get<T>(injectable: Injectable)** - Retrieves an instance of the injectable, throws:
    * **MissingProviderError** if dependency provider wasn't found
    * **RecursiveProviderError** in case of recursive dependency injection

### Full example
```typescript
import {
  Injectable,
  Inject,
  Container,
  InjectionToken
} from '@decorators/di';

const API_URL = new InjectionToken('API_URL');

@Injectable()
export class HttpService {
  constructor(
    @Inject(API_URL) private apiUrl: string
  ) {}

  public send(options: object): Promise<any> {
    return fetch(this.apiUrl, options);
  }
}

Container.provide([
  { provide: API_URL, useValue: 'http://server.localhost' }
]);

const httpService = Container.get<HttpService>(HttpService);
...
```
