import { Schema, model as Model, Model as IModel, Document } from 'mongoose';
import { getMongooseMeta } from '../utils';

export function bootstrapMongoose<T extends Document>(MongooseModel): IModel<T> {
  let meta: IMongooseMeta = getMongooseMeta(MongooseModel.prototype),
    schema: Schema = new Schema(meta.schema),
    model = MongooseModel.prototype;

  for (let key of Object.getOwnPropertyNames(MongooseModel)) {
    if (typeof MongooseModel[key] === 'function') {
      schema.statics[key] = MongooseModel[key];
    }
  }
  let modelKeys: string[] = Object.getOwnPropertyNames(model),
    index: number = modelKeys.indexOf('constructor');
  modelKeys.splice(index, 1);
  index = modelKeys.indexOf('__meta__');
  modelKeys.splice(index, 1);
  for (let key of modelKeys) {
    if (typeof model[key] === 'function') {
      schema.methods[key] = model[key];
    }
  }

  return Model<T>(meta.name, schema);
}
