import {
  Document,
  Model as IModel,
  Query as IQuery,
  Schema,
  MongooseDocument,
  ModelPopulateOptions,
  NativeError,
  ValidationError
} from 'mongoose';

/**
 * Basic class for model adds access (for intellisence) to most common
 * functions and properties that you might need to use.
 * If you need more, you can easily extend this one.
 *
 * The reason to have this class here is that mongoose doesn't provide
 * easier way to use classes and if you need to use **Document** methods and
 * properties in functions, defined in the class you have to provide proper
 * interface for them:
 *
 * @Model('User')
 * class Model extends ModelClass {
 *  @Instance()
 *  calculateAge() {
 *    this.age = this.dob.fullYear() - 1970;
 *    this.save();
 *  }
 * }
 */
export abstract class ModelClass {

  depopulate: (path: string) => void;

  equals: (doc: MongooseDocument) => boolean;

  execPopulate: () => Promise<this>;

  get: (path: string, type?: any) => any;

  invalidate: (path: string, errorMsg: string | NativeError, value: any, kind?: string) => ValidationError | boolean;

  isModified: (path?: string) => boolean;

  markModified: (path: string) => void;

  populate: ((callback: (err: any, res: this) => void) => this) |
    ((path: string, callback?: (err: any, res: this) => void) => this) |
    ((options: ModelPopulateOptions | ModelPopulateOptions[], callback?: (err: any, res: this) => void) => this);
  populated: (path: string) => any;

  set: ((path: string, val: any, options?: Object) => void)  | ((path: string, val: any, type: any, options?: Object) => void) | ((value: Object) => void);

  toJSON: (options?: any) => Object;
  toObject: (options?: any) => Object;

  update: ((doc: Object, callback?: (err: any, raw: any) => void) => IQuery<any>) | ((doc: Object, options: any, callback?: (err: any, raw: any) => void) => IQuery<any>);

  validate: ((callback?: (err: any) => void) => Promise<void>) | ((optional: Object, callback?: (err: any) => void) => Promise<void>);
  validateSync: (pathsToValidate: string | string[]) => Error;

  errors: Object;

  _id: any;

  isNew: boolean;

  schema: Schema;

  /* Document */
  model: (name: string) => IModel<any>;
  save: (fn?: (err: any, product: this, numAffected: number) => void) => Promise<this>;
  remove: (fn?: (err: any, product: this) => void) => Promise<this>;
  __v?: number;
}

/**
 * Bootstrap decorated class to native mongoose
 * @param DecoratedClass
 * @returns {Object} Mongoose model itself
 */
export function bootstrapMongoose<T extends Document>(DecoratedClass):IModel<T>;

/**
 * Quick helper function to link reference
 * @param {String} collectionRef
 * @returns { {type: "mongoose".Schema.Types.ObjectId, ref: string} }
 */
export function ref(collectionRef: string): { type: any, ref: string };

/**
 * Defines model class
 * @param {String} name Model name
 */
export function Model(name:string):ClassDecorator;

/**
 * Defines Schema field
 * @param type Field type
 */
export function SchemaField(type: any): PropertyDecorator;

/**
 * Defines static method or property
 */
export function Static();

/**
 * Defines query method
 */
export function Query();

/**
 * Defines instance method
 */
export function Instance();

/**
 * Defines virtual (computed) property (getter/setter)
 */
export function Virtual();

/**
 * Defines index
 */
export function Index();

/**
 * Defines set method - options for model
 */
export function Set();

/**
 * Alias of Set
 * @see {Set}
 */
export function Option();
