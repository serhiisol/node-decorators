import * as mongoose from 'mongoose';
import {
  SchemaField,
  Model,
  bootstrapMongoose,
  Static,
  Instance,
  ModelClass
} from '@decorators/mongoose';

(<any>mongoose).Promise = Promise;
mongoose.connect('192.168.99.100:27017/test', {
  "server": {
    "socketOptions": {
      "keepAlive": 1
    }
  }
});

interface TestInstance extends mongoose.Document {
  testField: string;
  instanceMethod();
}

interface TestModelType extends mongoose.Model<TestInstance> {
  new (args?: any): TestInstance;
  staticMethod();
}

@Model('Test')
  class TestModelClass extends ModelClass {

  @SchemaField(String)
  testField: string;

  @Static()
  staticMethod() {
    console.log('static test method');
  }

  @Instance()
  instanceMethod() {
    console.log(this.testField);
    this.save();
  }

}

export let TestModel = <TestModelType>bootstrapMongoose(TestModelClass);
