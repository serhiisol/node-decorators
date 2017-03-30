import { Schema, model as MongooseModel, Model as MongooseModelType, Document } from 'mongoose';

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
 * @description just to make sure, that functions will be executed with scope of class
 * in order to get DI working properly
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
 * Extract meta and classInstance of the injectable
 *
 * @param {(Injectable | Function)} injectable
 * @returns {{ meta: MongooseMeta, classInstance: any }}
 */
function getArtifacts(
  injectable: Injectable | Function
): { meta: MongooseMeta, classInstance: any } {
  const DecoratedModel: any = (<Injectable>injectable).provide || <MongooseClass>injectable;
  const deps = (<Injectable>injectable).deps || [];

  const meta: MongooseMeta = getMongooseMeta(DecoratedModel.prototype);
  const classInstance = new DecoratedModel(...deps);

  return { meta, classInstance };
}

/**
 * Build schema
 *
 * @param {MongooseMeta} meta
 * @param {any} classInstance
 * @returns {Schema}
 */
function buildSchema(meta: MongooseMeta, classInstance): Schema {
  let schema: Schema = new Schema(meta.schema);
  let indexes = {};

  meta.statics.forEach((stat: [string, Function] | string) => {
    if (typeof stat[1] === 'function') {
      schema.statics[<string>stat[0]] = wrapFunction(<Function>stat[1], classInstance);
    }
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

  return schema;
}

/**
 * Create mongoose schema out of @decorators/mongoose class
 * @param DecoratedClass
 * @returns {Object} Mongoose model itself
 */
export function schema(injectable: Injectable | Function): Schema {
  const { meta, classInstance } = getArtifacts(injectable);

  return buildSchema(meta, classInstance);
}

/**
 * Create mongoose model out of @decorators/mongoose class
 * @param DecoratedClass
 * @returns {Object} Mongoose model itself
 */
export function model<T extends Document>(injectable: Injectable | Function): MongooseModelType<T> {
  const { meta, classInstance } = getArtifacts(injectable);
  const statics = {};

  meta.statics.forEach((stat: [string, Function] | string) => {
    if (typeof stat[1] !== 'function') {
      statics[<string>stat] = classInstance[<string>stat];
    }
  });

  const model = <MongooseModelType<T>>MongooseModel(meta.name, buildSchema(meta, classInstance));

  extend(model, statics);

  return model;
}
