import { MongooseClass, MongooseMeta } from './interfaces';

export function getMongooseMeta(target: MongooseClass): MongooseMeta {
  if (!target.__meta__) {
    target.__meta__ = <MongooseMeta> {
      name: '',
      schema:    {},
      statics:   [],
      queries:   [],
      instances: [],
      virtuals:  [],
      indexes:   [],
      options:   []
    };
  }
  return <MongooseMeta>target.__meta__;
}

export function extend(_what, _to) {
  for(let key of Object.keys(_to)) {
    _what[key] = _to[key];
  }
  return _what;
}
