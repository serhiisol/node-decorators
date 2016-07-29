import { Schema, model as Model, Model as IModel, Document } from 'mongoose';
import { getMongooseMeta } from '../utils';

let blacklist: string[] = ['length', 'name', 'prototype', '__meta__', 'constructor']

function removeBlacklisted(keys: string[]) {
  return keys.filter(item => {
    return blacklist.indexOf(item) === -1;
  })
}

export function bootstrapMongoose<T extends Document>(MongooseModel): IModel<T> {
  let meta: IMongooseMeta = getMongooseMeta(MongooseModel.prototype),
    schema: Schema = new Schema(meta.schema),
    model = MongooseModel.prototype,
    staticKeys: string[] = removeBlacklisted(Object.getOwnPropertyNames(MongooseModel)),
    instanceKeys: string[] = removeBlacklisted(Object.getOwnPropertyNames(model));

  for (let key of staticKeys) {
    if (typeof MongooseModel[key] === 'function') {
      schema.statics[key] = MongooseModel[key];
    }
  }

  for (let key of instanceKeys) {
    if (typeof model[key] === 'function') {
      schema.methods[key] = model[key];
    }
  }

  model = Model<T>(meta.name, schema);

  for (let key of staticKeys) {
    if (typeof MongooseModel[key] !== 'function') {
      model[key] = MongooseModel[key];
    }
  }

  return model;
}
