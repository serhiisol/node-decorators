///<reference path="../../typings/index.d.ts"/>
///<reference path="express.d.ts"/>
///<reference path="mongoose.d.ts"/>

interface IDecoratedClass extends Object {
  __meta__: IExpressMeta | IMongooseMeta;
}

interface IParameterConfiguration {
  index: number;
  type: any;
  name?: string;
}

interface IParams {
  [key: string]: IParameterConfiguration[];
}
