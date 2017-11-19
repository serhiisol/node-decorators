import {
  Injectable,
  Inject,
  Container,
  InjectionToken,
  Optional
} from '@decorators/di';

// @Injectable()
export class HelloWorld {}

const helloWorld = Container.get<HelloWorld>(undefined);
console.log(helloWorld);
