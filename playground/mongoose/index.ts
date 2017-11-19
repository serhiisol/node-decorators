import { AnimalModel } from './model';

AnimalModel.staticMethod();

let test = new AnimalModel({ testField: 'Hello World' });

test.save(() => {
  console.log('saved 2');
  process.exit(0);
});
