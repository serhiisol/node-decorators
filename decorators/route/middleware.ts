import { getMeta } from '../utils';

export let Middleware = middle => (target, key, descriptor) => {
    let meta = getMeta(target);
    if (!meta.middleware[key]) {
      meta.middleware[key] = [];
    }
    meta.middleware[key].push(middle);
    return descriptor;
};
