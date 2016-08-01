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
      name: '',
      schema:    [],
      statics:   [],
      queries:   [],
      instances: [],
      virtuals:  [],
      indexes:   [],
      options:   []
    };
  }
  return <IMongooseMeta>target.__meta__;
}

export function extend(_what, _to) {
  for(let key of Object.keys(_to)) {
    _what[key] = _to[key];
  }
  return _what;
}
