import { TestModel } from './model';


TestModel.staticMethod();
let test = new TestModel({testField: "Hello World"});
console.log('Model = ' + test.toString());
test.setField();

test.instanceMethod();

console.log('Model = ' + test.testField);

process.exit();

