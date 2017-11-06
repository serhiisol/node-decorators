import * as mongoose from 'mongoose';
import { SchemaField, Model, Static, Instance, Hook, model } from '@decorators/mongoose';
import { Container, Injectable, Inject, InjectionToken } from '@decorators/di';

(mongoose as any).Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/test', {
  useMongoClient: true
});

const TEST_ARG = new InjectionToken('TEST_ARG');

@Model('Animal')
@Injectable()
export class Animal {

  @Static()
  static staticField = 'static test field';

  @SchemaField(String)
  testField: string;

  @Static()
  static staticMethod() {
    console.log('static test method');
  }

  constructor(@Inject(TEST_ARG) private message: string) {}

  @Instance()
  setField() {
    this.testField = 'World';
    console.log(this.testField, this.message);
  }

  @Hook('pre', 'save')
  preSave(next) {
    console.log('pre save');
    next();
  }

}
export interface Animal extends mongoose.Document {}

Container.provide([
  { provide: TEST_ARG, useValue: 'Mongoose welcomes you' }
]);

export const AnimalModel: AnimalType = model(Animal);
type AnimalType = mongoose.Model<Animal> & typeof Animal;

console.log(AnimalModel.schema.indexes);
