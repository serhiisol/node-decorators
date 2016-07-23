import { getMongooseMeta } from '../../utils';

export let Schema = (schema: any): ClassDecorator  => {
  return (target: Function): void => {
    getMongooseMeta(target.prototype).schema = schema;
  }
};
