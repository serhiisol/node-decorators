///<reference path="default.d.ts"/>
interface IMongooseMeta {
  name:      string;
  schema:    any;
  statics:   [ [string, Function] | string ];
  queries:   [ [string, Function] ];
  instances: [ [string, Function] ];
  virtuals:  [ [string, PropertyDescriptor] ];
  indexes:   string[];
  options:   string[];
}
