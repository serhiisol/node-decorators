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
  controllerMiddleware: Function[];
  middleware: Middleware;
  params: Params;
}

interface ExpressClass extends Object {
  __meta__: ExpressMeta;
}
