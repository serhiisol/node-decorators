interface ParameterConfiguration {
  index: number;
  type: any;
  name?: string;
}

interface Params {
  [key: string]: ParameterConfiguration[];
}

interface Route {
  method: string;
  url: string;
}

interface Routes {
  [key: string]: Route
}

interface Middleware {
  [key: string]: Function[];
}

interface ExpressMeta {
  baseUrl: string;
  routes: Routes;
  middleware: Middleware;
  params: Params;
}

interface ExpressClass extends Object {
  __meta__: ExpressMeta;
}
