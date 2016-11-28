import { Router, Express } from 'express';
import { ParameterType } from './interface';

function getParam(source: any, paramType: string, name: string) {
  let param = source[paramType];
  return param[name] || param;
}

function extractParameters(req, res, next, params): any[] {
  let args = [];
  if (!params || !params.length) {
    return [req, res, next];
  }
  for (let item of params) {

    switch(item.type) {
      case ParameterType.RESPONSE: args[item.index] = res; break;
      case ParameterType.REQUEST: args[item.index] = req; break;
      case ParameterType.NEXT: args[item.index] = next; break;
      case ParameterType.PARAMS: args[item.index] = getParam(req, 'params', item.name); break;
      case ParameterType.QUERY: args[item.index] = getParam(req, 'query', item.name); break;
      case ParameterType.BODY: args[item.index] = getParam(req, 'body', item.name); break;
      case ParameterType.HEADERS: args[item.index] = getParam(req, 'headers', item.name); break;
      case ParameterType.COOKIES: args[item.index] = getParam(req, 'cookies', item.name); break;
    }

  }
  return args;
}

function registerController(app, Controller) {
  let controller = new Controller(),
    router = Router(),
    routes: Routes = controller.__meta__.routes,
    middleware: Middleware = controller.__meta__.middleware,
    baseUrl: string = controller.__meta__.baseUrl,
    params: Params = controller.__meta__.params;

  for (let methodName in routes) {
    let method: string = routes[methodName].method, fn: Function;

    fn = (req, res, next) => {
      let args = extractParameters(req, res, next, params[methodName]);
      return controller[methodName].apply(controller, args)
    };

    let routeArgs = [
      routes[methodName].url, ...(middleware[methodName] || []), fn
    ];

    router[method].apply(router, routeArgs);
  }

  app.use(baseUrl, router);

  return app;
}

export function bootstrapControllers(app: Express, controllers: any[]) {
  try {
    controllers.forEach(controller => {
      registerController(app, controller);
    })
  } catch (e) {
    console.log('Second parameter should be array of controllers', e, e.message);
  }
}
