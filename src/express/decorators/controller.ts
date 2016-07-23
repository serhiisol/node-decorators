import { getExpressMeta } from '../../utils';

export let Controller = (baseUrl: string): ClassDecorator  => {
  return (target: Function): void => {
    let meta: IExpressMeta = getExpressMeta(target.prototype);
    meta.baseUrl = baseUrl;
  }
};

