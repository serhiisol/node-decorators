import {Document, Model as IModel} from 'mongoose';

export function Schema(schemaDefinition:any):ClassDecorator;

export function Model(name:string):ClassDecorator;

export function bootstrapMongoose<T extends Document>(MongooseModel):IModel<T>;

export function Static(target:any, name:string, descriptor?:TypedPropertyDescriptor<any>);

export function Query(target: any, name:string, descriptor:TypedPropertyDescriptor<any>);

export function Instance(target: any, name:string, descriptor:TypedPropertyDescriptor<any>);

export function Virtual(target: any, name: string, descriptor: PropertyDescriptor);

export function Index(target: any, name:string);

export function Set(target: any, name:string);
export function Option(target: any, name:string);
