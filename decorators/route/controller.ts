import { getMeta } from '../utils';

export let Controller = (baseUrl: string) => target => {
  getMeta(target.prototype).baseUrl = baseUrl;
};

