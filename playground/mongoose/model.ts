import * as mongoose from 'mongoose';
import {
  SchemaField,
  Model,
  model,
  Static,
  Instance
} from '@decorators/mongoose';

import { AbstractModel } from './abstract.model';

(<any>mongoose).Promise = Promise;
mongoose.connect('192.168.99.100:27017/test', {
  server: {
    socketOptions: {
      keepAlive: 1
    }
  }
});

@Model('Animal')
class AnimalClass extends AbstractModel {

  @SchemaField(String)
  testField: string;

  args: any;

  @Static()
  staticField = true;

  constructor(...args) {
    super();
    this.args = args;
  }

  @Static()
  staticMethod() {
    console.log('static test method');
  }

  @Instance()
  setField() {
    this.testField = 'World';
    console.log(this.testField, this.args);
  }

  @Instance()
  instanceMethod() {
    console.log(this.testField, this.args);

    this.save();
  }

}

export type AnimalType = AnimalClass & mongoose.Document;
export type AnimalModel = mongoose.Model<AnimalType>;
export const Animal = model<AnimalType>({
  provide: AnimalClass, deps: [1, 2, 3]
});
