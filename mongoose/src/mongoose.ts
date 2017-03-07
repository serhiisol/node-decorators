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
 * Wrap function with correct context
 *
 * @param {Function} fn
 * @param {any} instance
 * @returns {Function}
 */
function wrapFunction(fn: Function, instance): Function {
  return function(...args) {
    const fullCtx = Object.assign({}, instance, this);
    Object.setPrototypeOf(fullCtx, Object.getPrototypeOf(this));

    return fn.apply(fullCtx, args);
  };
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
      return schema.statics[<string>stat[0]] = wrapFunction(<Function>stat[1], classInstance);
    }
    statics[<string>stat] = classInstance[<string>stat];
  });

  meta.queries.forEach(([name, fn]: [string, Function]) => {
    schema['query'][name] = wrapFunction(fn, classInstance);
  });

  meta.instances.forEach(([name, fn]: [string, Function]) => {
    schema.methods[name] = wrapFunction(fn, classInstance);
  });

  meta.virtuals.forEach(([name, descriptor]: [string, PropertyDescriptor]) => {
    let v = schema.virtual(name);
    if (descriptor.get) {
      v.get(wrapFunction(descriptor.get, classInstance));
    }
    if (descriptor.set) {
      v.set(wrapFunction(descriptor.set, classInstance));
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
