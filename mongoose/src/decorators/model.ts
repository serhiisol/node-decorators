import { getMongooseMeta } from '../meta';

export let Model = (name: string) => {
  return (target: Function) => {
    getMongooseMeta(target.prototype).name = name;
  }
};
