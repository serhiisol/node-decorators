import { getExpressMeta } from '../meta';

export let Controller = (baseUrl: string): ClassDecorator  => {
  return (target: Function): void => {
    let meta: ExpressMeta = getExpressMeta(target.prototype);
    meta.baseUrl = baseUrl;
  }
};

