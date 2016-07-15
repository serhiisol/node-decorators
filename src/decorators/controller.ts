import { getMeta } from '../utils';

export let Controller = (baseUrl: string): ClassDecorator  => {
  return (target: Function): void => {
    let meta: IMeta = getMeta(target.prototype);
    meta.baseUrl = baseUrl;
  }
};

