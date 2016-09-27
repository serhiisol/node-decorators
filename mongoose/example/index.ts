import { TestModel } from './model';

TestModel.staticMethod();
let test = new TestModel();
test.testField = "Hello World";
test.instanceMethod();
test.save(() => {
  console.log('Mongoose <br/>' + test.toString());
  process.exit();
});
