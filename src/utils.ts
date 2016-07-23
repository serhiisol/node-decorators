export function getExpressMeta(target: IDecoratedClass): IExpressMeta {
  if (!target.__meta__) {
    target.__meta__ = <IExpressMeta>{
      baseUrl: '',
      routes: {},
      middleware: {},
      params: {}
    };
  }
  return <IExpressMeta>target.__meta__;
}

export function getMongooseMeta(target: IDecoratedClass): IMongooseMeta {
  if (!target.__meta__) {
    target.__meta__ = <IMongooseMeta>{
      schema: {},
      name: ''
    };
  }
  return <IMongooseMeta>target.__meta__;
}
