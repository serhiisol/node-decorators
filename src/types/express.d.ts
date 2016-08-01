///<reference path="default.d.ts"/>
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

interface IExpressMeta {
  baseUrl: string;
  routes: IRoutes;
  middleware: IMiddleware;
  params: IParams;
}
