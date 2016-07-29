import {connect, Document, Model as IModel } from 'mongoose';
import {Schema, Model, bootstrapMongoose} from '../index';

connect('192.168.99.100:27017/test', {
  "server": {
    "socketOptions": {
      "keepAlive": 1
    }
  }
});

@Schema({
  testField: String
})
@Model('Test')
class TestModelClass {
  static staticMethod() {
    console.log('static test method')
  }

  static staticProperty: string = "Hello World";

  instanceMethod() {
    console.log(this);
  }
}
interface ITest {
  testField: string;
}

interface ITestInstance extends ITest, Document {
  instanceMethod(): void;
}
interface ITestModel extends IModel <ITestInstance>{
  staticMethod();
  staticProperty: string;
}
export let TestModel: ITestModel = <ITestModel>bootstrapMongoose(TestModelClass);
