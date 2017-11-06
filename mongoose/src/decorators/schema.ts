import { getMongooseMeta } from '../meta';

/**
 * Defines Schema field
 * @param {*} type Field type
 */
export function SchemaField(type: any): PropertyDecorator {
  return (target: any, name: string) => {
    getMongooseMeta(target).schema[name] = type;
  };
}

/**
 * Defines static method or property
 */
export function Static() {
  return (target: any, name: string, descriptor?: TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target.prototype).statics.push(descriptor ? [name, target[name]] : name);
  };
}

/**
 * Defines query method
 */
export function Query() {
  return (target: any, name: string) => {
    getMongooseMeta(target).queries.push([name, target[name]]);
  };
}

/**
 * Defines instance method
 */
export function Instance() {
  return (target: any, name: string) => {
    getMongooseMeta(target).instances.push([name, target[name]]);
  };
}

/**
 * Defines virtual (computed) property (getter/setter)
 */
export function Virtual() {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    getMongooseMeta(target).virtuals.push([name, descriptor]);
  };
}

/**
 * Defines index
 */
export function Index() {
  return (target: any, name: string) => {
    getMongooseMeta(target).indexes.push(name);
  };
}

/**
 * Defines pre-hoos
 *
 * @param {string} hookType
 * @param {string} actionType
 */
export function Hook(hookType: string, actionType: string) {
  return (target: any, name: string) => {
    getMongooseMeta(target).hooks.push([hookType, actionType, name]);
  };
}
