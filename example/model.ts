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
  static testMethod() {
    console.log('static test method')
  }

  instanceMethod() {
    console.log(this);
  }
}
interface ITestModel {
  testField: string;
}
interface ITestModelType extends ITestModel, Document {
  instanceMethod(): void;
}
export let TestModel: IModel<ITestModelType> = bootstrapMongoose<ITestModelType>(TestModelClass);
