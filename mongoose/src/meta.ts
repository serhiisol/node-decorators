export type Fn = (...args: any[]) => any;

export type HookType = 'pre' | 'post' | string;
export type ActionType = 'save' | 'find' | string;

export class MongooseMeta {
  name:      string;
  schema:    any = {};
  statics:   Array<[string, Fn] | string> = [];
  queries:   Array<[string, Fn]> = [];
  instances: Array<[string, Fn]> = [];
  virtuals:  Array<[string, PropertyDescriptor]> = [];
  indexes:   string[] = [];
  options:   Array<[string, any]> = [];
  hooks: Array<[HookType, ActionType, string]> = [];
}

export interface MongooseClass extends Object {
  __mongoose_meta__: MongooseMeta;

  new (...deps: any[]);
}

export function getMongooseMeta(target: MongooseClass): MongooseMeta {
  if (!target.__mongoose_meta__) {
    target.__mongoose_meta__ = new MongooseMeta();
  }

  return target.__mongoose_meta__;
}
