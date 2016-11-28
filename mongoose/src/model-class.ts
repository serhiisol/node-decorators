import {
  Model,
  Query,
  Schema,
  MongooseDocument,
  ModelPopulateOptions,
  NativeError,
  ValidationError
} from 'mongoose';

/**
 * Basic class for model adds access (for intellisence and ts compiler) to most common
 * functions and properties that you might need to use.
 * If you need more, you can easily extend this one.
 *
 * That's not TS right way to do that, but in this case, mongoose decorators project
 * mixins the JS stuff (produced by mongoose) and TS (produced by this project).
 * We should give access to that API.
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

  update: ((doc: Object, callback?: (err: any, raw: any) => void) => Query<any>) | ((doc: Object, options: any, callback?: (err: any, raw: any) => void) => Query<any>);

  validate: ((callback?: (err: any) => void) => Promise<void>) | ((optional: Object, callback?: (err: any) => void) => Promise<void>);
  validateSync: (pathsToValidate: string | string[]) => Error;

  errors: Object;

  _id: any;

  isNew: boolean;

  schema: Schema;

  /* Document */
  model: (name: string) => Model<any>;
  save: (fn?: (err: any, product: this, numAffected: number) => void) => Promise<this>;
  remove: (fn?: (err: any, product: this) => void) => Promise<this>;
  __v?: number;
}
