import { getMongooseMeta } from '../meta';

/**
 * Defines model class
 * @param {String} name Model name
 */
export let Model = (name: string) => {
  return (target: Function) => {
    getMongooseMeta(target.prototype).name = name;
  }
};
