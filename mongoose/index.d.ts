import {Document, Model as IModel} from 'mongoose';

export function Model(name:string):ClassDecorator;

export function bootstrapMongoose<T extends Document>(MongooseModel):IModel<T>;

export function SchemaField(type: any): PropertyDecorator;

export function Static();

export function Query();

export function Instance();

export function Virtual();

export function Index();

export function Set();

export function Option();
