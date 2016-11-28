import { getMongooseMeta } from '../meta';

/**
 * Defines Schema field
 * @param type Field type
 */
export function SchemaField(type: any): PropertyDecorator {
  return (target: any, name:string) => {
    Object.assign(getMongooseMeta(target).schema, {[name]: type});
  }
}

/**
 * Defines static method or property
 */
export function Static() {
  return (target:any, name:string, descriptor?:TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target).statics.push(descriptor ? [name, target[name]] : name);
  }
}

/**
 * Defines query method
 */
export function Query() {
  return (target: any, name:string, descriptor:TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target).queries.push([name, target[name]]);
  }
}

/**
 * Defines instance method
 */
export function Instance() {
  return (target: any, name:string, descriptor:TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target).instances.push([name, target[name]]);
  }
}

/**
 * Defines virtual (computed) property (getter/setter)
 */
export function Virtual() {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    getMongooseMeta(target).virtuals.push([name, descriptor]);
  }
}

/**
 * Defines index
 */
export function Index() {
  return (target: any, name:string) => {
    getMongooseMeta(target).indexes.push(name);
  }
}

/**
 * Defines set method - options for model
 */
export function Set() {
  return (target: any, name: string) => {
    getMongooseMeta(target).options.push(name);
  }
}
/**
 * Alias of Set
 * @see {Set}
 */
export const Option = Set;
