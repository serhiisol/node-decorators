import {getMongooseMeta} from '../../utils';

export let Schema = (schema:any):ClassDecorator => {
  return (target:Function):void => {
    getMongooseMeta(target.prototype).schema = schema;
  }
};

export function Static(target:any, name:string, descriptor?:TypedPropertyDescriptor<any>) {
  getMongooseMeta(target).statics.push(descriptor ? [name, target[name]] : name);
}

export function Query(target: any, name:string, descriptor:TypedPropertyDescriptor<any>) {
  getMongooseMeta(target).queries.push([name, target[name]]);
}

export function Instance(target: any, name:string, descriptor:TypedPropertyDescriptor<any>) {
  getMongooseMeta(target).instances.push([name, target[name]]);
}

export function Virtual(target: any, name: string, descriptor: PropertyDescriptor) {
  getMongooseMeta(target).virtuals.push([name, descriptor]);
}

export function Index(target: any, name:string) {
  getMongooseMeta(target).indexes.push(name);
}

export function Set(target: any, name:string) {
  getMongooseMeta(target).options.push(name);
}
export let Option = Set;
