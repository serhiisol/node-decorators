import { Animal } from './model';


Animal.staticMethod();
let test = new Animal({testField: "Hello World"});
console.log('Model = ' + test.toString());
test.setField();

test.instanceMethod();

console.log('Model = ' + test.testField);

process.exit();

