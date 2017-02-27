export interface MongooseMeta {
  name:      string;
  schema:    any;
  statics:   [ [string, Function] | string ];
  queries:   [ [string, Function] ];
  instances: [ [string, Function] ];
  virtuals:  [ [string, PropertyDescriptor] ];
  indexes:   string[];
  options:   string[];
}

export interface MongooseClass extends Object {
  __meta__: MongooseMeta;

  new (...deps: any[]);
}

export interface Injectable {
  provide: Function;
  deps: any[];
}
