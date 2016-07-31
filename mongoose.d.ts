declare module "node-decorators/mongoose" {
  import {Document, Model as IModel} from 'mongoose';

  export function Schema(schemaDefinition:any):ClassDecorator;

  export function Model(name:string):ClassDecorator;

  export function bootstrapMongoose<T extends Document>(MongooseModel):IModel<T>;

}
