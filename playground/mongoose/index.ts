import { AnimalModel } from './model';

AnimalModel.staticMethod();
console.log(AnimalModel.staticField);

let test = new AnimalModel({ testField: 'Hello World' });

console.log('Model = ' + test.toString());

// test.setField();

// test.testField = 'Test Field';

test.save(() => {
  console.log('saved 2');
  process.exit(0);
});
