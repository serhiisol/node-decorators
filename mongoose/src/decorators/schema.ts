import { getMongooseMeta } from '../meta';

export function SchemaField(type: any): PropertyDecorator {
  return (target: any, name:string) => {
    Object.assign(getMongooseMeta(target).schema, {[name]: type});
  }
}

export function Static() {
  return (target:any, name:string, descriptor?:TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target).statics.push(descriptor ? [name, target[name]] : name);
  }
}

export function Query() {
  return (target: any, name:string, descriptor:TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target).queries.push([name, target[name]]);
  }
}

export function Instance() {
  return (target: any, name:string, descriptor:TypedPropertyDescriptor<any>) => {
    getMongooseMeta(target).instances.push([name, target[name]]);
  }
}

export function Virtual() {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    getMongooseMeta(target).virtuals.push([name, descriptor]);
  }
}

export function Index() {
  return (target: any, name:string) => {
    getMongooseMeta(target).indexes.push(name);
  }
}

export function Set() {
  return (target: any, name: string) => {
    getMongooseMeta(target).options.push(name);
  }
}

export const Option = Set;
