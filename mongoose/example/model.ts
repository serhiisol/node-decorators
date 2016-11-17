import * as mongoose from 'mongoose';
import {
  Schema,
  Model as M,
  bootstrapMongoose,
  Static,
  Query,
  Instance,
  Virtual,
  Index,
  Set
} from '../index';






(<any>mongoose).Promise = Promise;

mongoose.connect('192.168.99.100:27017/test', {
  "server": {
    "socketOptions": {
      "keepAlive": 1
    }
  }
});

@Schema({
  testField: String
})
@M('Test')
class TestModelClass {

  @Static
  staticMethod() {
    console.log('static test method')
  }

  @Static
  staticProperty: string = "Hello World";

  @Query
  byName(name) {
    return this['find']({ name: new RegExp(name, 'i') });
  }

  @Instance
  instanceMethod() {
    console.log(this);
  }

  @Virtual
  set password(val) {
    console.log('set');
  }

  get password() {
    console.log('get');
    return true
  }

  @Index
  name: number = 1;

  @Index
  type: number = -1;

  @Set
  autoIndex: boolean = true
}

interface TestInstance extends mongoose.Document {
  testField: string;
  instanceMethod(): void;
}

type TestModelType = mongoose.Model<TestInstance> & {
  new (args?: any): TestInstance;
  staticMethod();
  staticProperty: string;
}

export let TestModel = <TestModelType>bootstrapMongoose(TestModelClass);
