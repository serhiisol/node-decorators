/* eslint-disable max-classes-per-file */

import {
  Injectable,
  Inject,
  Container,
  Optional,
} from '../src';


function delay(data: any) {
  return new Promise(resolve =>
    setTimeout(() => resolve(data), 3000),
  );
}


const dependencyContainer = new Container();

@Injectable()
export class Dependency {
  message = 'Dependency';
}

dependencyContainer.provide([{
  provide: Dependency,
  useClass: Dependency,
}]);


const container = new Container();

container.setParent(dependencyContainer);

@Injectable()
export class Service {
  constructor(
    @Optional() private dependency: Dependency,
    @Inject('Message') private message: string,
    @Inject('Message2') @Optional() private message2: string,
  ) {}

  sentence() {
    return `Class says: dep=${this.dependency.message}, message=${this.message}, message2=${this.message2}`;
  }
}

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


async function bootstrap() {
  const service = await container.get<Service>('Hello World');

  console.log(service.sentence());
}

bootstrap().catch(console.error);
