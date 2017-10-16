import {
  Injectable,
  Inject,
  Container,
  InjectionToken,
  Optional
} from './src';

const TEST_STRING = new InjectionToken('TEST_STRING');
const TEST_STRING2 = new InjectionToken('TEST_STRING2');

@Injectable()
export class Test {
  constructor(@Inject(TEST_STRING2) @Optional() private str: string) {}

  public toString() { return this.str; }
}

@Injectable()
export class Test2 {
  constructor(@Inject(Test) private test: Test) {}

  public toTest() { return this.test; }
}

@Injectable()
export class HelloWorld {
  constructor(private test2: Test2) {}

  public toTest2() { return this.test2; }
}

Container.provide([
  { provide: TEST_STRING, useValue: 'Hello World' },
  { provide: TEST_STRING2, useFactory: (str) => `${str}2`, deps: [TEST_STRING] },
  { provide: Test2, useClass: Test }
]);

const helloWorld = Container.get<HelloWorld>(HelloWorld);
console.log(helloWorld);
