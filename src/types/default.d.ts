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
