import { getMongooseMeta } from '../../utils';

export let Model = (name: string): ClassDecorator  => {
  return (target: Function): void => {
    getMongooseMeta(target.prototype).name = name;
  }
};
