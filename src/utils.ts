function ensureMeta(target: Object): void {
  if (!target.__meta__) {
    target.__meta__ = <IMeta>{
      baseUrl: '',
      routes: {},
      middleware: {},
      params: {}
    };
  }
}

export function getMeta(target: Object): IMeta {
  ensureMeta(target);
  return target.__meta__;
}
