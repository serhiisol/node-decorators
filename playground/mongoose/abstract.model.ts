import { MongooseDocument, Model, Document } from 'mongoose';

export interface AbstractModel extends MongooseDocument {
  /**
   * Version using default version key. See http://mongoosejs.com/docs/guide.html#versionKey
   * If you're using another key, you will have to access it using []: doc[_myVersionKey]
   */
  __v?: number;

  update(data: any);
  increment?(): this;

  /**
   * Returns another Model instance.
   * @param name model name
   */
  model?(name: string): Model<Document>;

  /**
   * Removes this document from the db.
   * @param fn optional callback
   */
  remove?(fn?: (err: any, product: this) => void): Promise<this>;

  /**
   * Saves this document.
   * @param options options optional options
   * @param options.safe overrides schema's safe option
   * @param options.validateBeforeSave set to false to save without validating.
   * @param fn optional callback
   */
  save?(fn?: (err: any, product: this, numAffected: number) => void): Promise<this>;
}

export abstract class AbstractModel {}
