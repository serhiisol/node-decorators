import { Animal, AnimalSchema } from './model';

console.log(AnimalSchema.create);

Animal.staticMethod();
console.log(Animal.staticField);

let test = new Animal({ testField: 'Hello World' });

console.log('Model = ' + test.toString());

test.setField();

test.testField = 'Test Field';

test.instanceMethod();

process.exit(0);
