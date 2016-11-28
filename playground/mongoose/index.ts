import { TestModel } from './model';


TestModel.staticMethod();
let test = new TestModel({testField: "Hello World"});
console.log('Model = ' + test.toString());
test.instanceMethod();
process.exit();

