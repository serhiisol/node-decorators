import { getMongooseMeta } from '../meta';
import { SchemaTypeOpts } from 'mongoose';
/**
 * Defines model class
 * @param {String} name Model name
 * @param {SchemaTypeOpts} options
 */
export let Model = (name: string, options?: SchemaTypeOpts<any>) => {
  return (target: Function) => {
    const mongooseMeta = getMongooseMeta(target.prototype);
    mongooseMeta.name = name;
    if (options) {
      Object.keys(options)
        .forEach((key) => {
          mongooseMeta.options.push([key, options[key]]);
        });
    }
  }
};
