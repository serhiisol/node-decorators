import { Schema, model as MongooseModel } from 'mongoose';
import { Container } from '@decorators/di';

import { getMongooseMeta, Fn, MongooseClass, MongooseMeta } from './meta';

/**
 * Quick helper function to link reference
 *
 * @param {String} collectionRef
 *
 * @returns { {type: "mongoose".Schema.Types.ObjectId, ref: string} }
 */
export function ref(collectionRef: string): { type: any, ref: string } {
  return { type: Schema.Types.ObjectId, ref: collectionRef };
}

/**
 * Create mongoose schema out of @decorators/mongoose class
 *
 * @param {MongooseClass} modelClass
 *
 * @returns {Object} Mongoose model itself
 */
export function schema(modelClass: MongooseClass): Schema {
  const { meta, instance } = getArtifacts(modelClass);

  return buildSchema(meta, instance);
}

/**
 * Create mongoose model out of @decorators/mongoose class
 *
 * @param {MongooseClass} modelClass
 *
 * @returns {Object} Mongoose model itself
 */
export function model<T>(modelClass: MongooseClass): T {
  const { meta, instance } = getArtifacts(modelClass);
  const statics = {};

  meta.statics.forEach((stat: [string, Fn] | string) => {
    if (typeof stat[1] !== 'function') {
      statics[<string>stat] = modelClass[<string>stat];
    }
  });

  const newModel = MongooseModel(meta.name, buildSchema(meta, instance));

  /**
   * Extend model with statics
   */
  for (let key of Object.keys(statics)) {
    newModel[key] = statics[key];
  }

  return newModel as any;
}

/**
 * Build schema
 *
 * @param {MongooseMeta} meta
 * @param {any} classInstance
 *
 * @returns {Schema}
 */
function buildSchema(meta: MongooseMeta, classInstance): Schema {
  let newSchema: Schema = new Schema(meta.schema);
  let indexes = {};

  meta.statics.forEach((stat: [string, Fn] | string) => {
    if (typeof stat[1] === 'function') {
      newSchema.statics[<string>stat[0]] = wrapFunction(<Fn>stat[1], classInstance);
    }
  });

  meta.queries.forEach(([name, fn]: [string, Fn]) => {
    newSchema['query'][name] = wrapFunction(fn, classInstance);
  });

  meta.instances.forEach(([name, fn]: [string, Fn]) => {
    newSchema.methods[name] = wrapFunction(fn, classInstance);
  });

  meta.virtuals.forEach(([name, descriptor]: [string, PropertyDescriptor]) => {
    const virtual = newSchema.virtual(name);

    if (descriptor.get) {
      virtual.get(wrapFunction(descriptor.get, classInstance));
    }

    if (descriptor.set) {
      virtual.set(wrapFunction(descriptor.set, classInstance));
    }
  });

  meta.indexes.forEach((index: string) => {
    indexes[index] = classInstance[index];
    newSchema.index({ [index]: classInstance[index] });
  });
  // newSchema.index(indexes);

  meta.options.forEach(([option, value]: [string, any]) => {
    newSchema.set(option, value);
  });

  meta.hooks.forEach(([hookType, actionType, name]: [string, string, string]) => {
    newSchema[hookType](actionType, function(next) {
      /**
       * Hook expects to get exactly one parameter, so
       * wrapped function cannot be passed as an argument
       */
      return wrapFunction(classInstance[name], classInstance).call(this, next);
    });
  });

  return newSchema;
}

/**
 * Wrap function with correct context just to make sure,
 * that functions will be executed with scope of class
 * in order to get DI working properly
 *
 * @param {Function} fn
 * @param {any} instance
 *
 * @returns {Function}
 */
function wrapFunction(fn: Fn, instance): Fn {
  return function(next) {
    let fullCtx = instance;

    if (this) {
      fullCtx = { ...instance, ...(this || {}) };
      Object.setPrototypeOf(fullCtx, Object.getPrototypeOf(this));
    }

    return fn.apply(fullCtx, [next]);
  };
}

/**
 * Extract meta and classInstance of the injectable
 *
 * @param {MongooseClass} modelClass
 *
 * @returns {{ meta: MongooseMeta, instance: MongooseClass }}
 */
function getArtifacts(modelClass: MongooseClass): { meta: MongooseMeta, instance: MongooseClass } {
  const instance: MongooseClass = getModel(modelClass);
  const meta: MongooseMeta = getMongooseMeta(instance);

  return { meta, instance };
}

/**
 * Get model instance from container or instantiate one
 *
 * @param {MongooseClass} ModelClass
 *
 * @returns {MongooseClass}
 */
function getModel(ModelClass: MongooseClass): MongooseClass {
  try {
    return Container.get(ModelClass);
  } catch {
    return new ModelClass();
  }
}
