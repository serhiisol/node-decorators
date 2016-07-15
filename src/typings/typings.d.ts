interface Object {
  __meta__: IMeta;
}

interface IRoute {
  method: string;
  url: string;
}

interface IRoutes {
  [key: string]: IRoute
}

interface IMiddleware {
  [key: string]: Function[];
}

interface IParameterConfiguration {
  index: number;
  type: any;
  name?: string;
}

interface IParams {
  [key: string]: IParameterConfiguration[];
}

interface IMeta {
  baseUrl: string;
  routes: IRoutes;
  middleware: IMiddleware;
  params: IParams;
}


