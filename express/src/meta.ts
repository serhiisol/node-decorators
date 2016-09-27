export function getExpressMeta(target: ExpressClass): ExpressMeta {
  if (!target.__meta__) {
    target.__meta__ = <ExpressMeta>{
      baseUrl: '',
      routes: {},
      middleware: {},
      params: {}
    };
  }
  return <ExpressMeta>target.__meta__;
}
