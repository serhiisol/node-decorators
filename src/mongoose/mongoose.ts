import { Schema, model as Model, Model as IModel, Document } from 'mongoose';
import { getMongooseMeta } from '../utils';

export function bootstrapMongoose<T extends Document>(MongooseModel): IModel<T> {
  let meta: IMongooseMeta = getMongooseMeta(MongooseModel.prototype),
    schema: Schema = new Schema(meta.schema),
    model = MongooseModel.prototype;

  for (let key in MongooseModel) {
    if (MongooseModel.hasOwnProperty(key)) {
      schema.statics[key] = MongooseModel[key];
    }
  }
  for (let key in model) {
    if (model.hasOwnProperty(key)) {
      schema.methods[key] = model[key];
    }
  }

  return Model<T>(meta.name, schema);
}
