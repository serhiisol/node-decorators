function ensureMeta(target: any) {
  if (!target.__meta__) {
    target.__meta__ = {
      baseUrl: '',
      routes: {},
      middleware: {},
      params: {}
    };
  }
}

export function getMeta(target: any) {
  ensureMeta(target);
  return target.__meta__;
}
