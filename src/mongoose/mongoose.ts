import { Schema, model as Model } from 'mongoose';
import { getMongooseMeta, extend } from '../utils';

export function bootstrapMongoose(DecoratedClass) {
  let meta: IMongooseMeta = getMongooseMeta(DecoratedClass.prototype),
    classInstance = new DecoratedClass(),
    schema: Schema = new Schema(meta.schema),
    statics = {},
    indexes = {},
    model;

  meta.statics.forEach(stat => {
    if (typeof stat[1] === 'function') {
      schema.statics[<string>stat[0]] = <Function>stat[1]
    } else {
      statics[<string>stat] = classInstance[<string>stat];
    }
  });

  meta.queries.forEach((query: [string, Function]) => {
    schema['query'][query[0]] = query[1];
  });

  meta.instances.forEach((instance: [string, Function]) => {
    schema.methods[instance[0]] = instance[1];
  });

  meta.virtuals.forEach((virtual: [string, PropertyDescriptor]) => {
    let v = schema.virtual(virtual[0]);
    if (virtual[1].get) {
      v.get(virtual[1].get);
    }
    if (virtual[1].set) {
      v.set(virtual[1].set);
    }
  });

  meta.indexes.forEach((index: string) => {
    indexes[index] = classInstance[index];
  });
  schema.index(indexes);

  meta.options.forEach((option: string) => {
    schema.set(option, classInstance[option]);
  });

  model = Model(meta.name, schema);
  extend(model, statics);

  return model;
}
