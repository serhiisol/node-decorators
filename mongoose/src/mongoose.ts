import { Schema, model as Model, Model as IModel, Document } from 'mongoose';

import { MongooseClass, Injectable, MongooseMeta } from './interfaces';
import { getMongooseMeta, extend } from './meta';

/**
 * Quick helper function to link reference
 * @param {String} collectionRef
 * @returns { {type: "mongoose".Schema.Types.ObjectId, ref: string} }
 */
export function ref(collectionRef: string): { type: any, ref: string } {
  return { type: Schema.Types.ObjectId, ref: collectionRef };
}

/**
 * Bootstrap decorated class to native mongoose
 * @param DecoratedClass
 * @returns {Object} Mongoose model itself
 */
export function bootstrapMongoose<T extends Document>(injectable: Injectable | Function): IModel<T> {
  let DecoratedModel: any = (<Injectable>injectable).provide || <MongooseClass>injectable;
  let deps = (<Injectable>injectable).deps || [];

  let meta: MongooseMeta = getMongooseMeta(DecoratedModel.prototype);
  let classInstance = new DecoratedModel(...deps);
  let schema: Schema = new Schema(meta.schema);
  let statics = {};
  let indexes = {};
  let model;

  meta.statics.forEach((stat: [string, Function] | string) => {
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

  return <IModel<T>>model;
}
