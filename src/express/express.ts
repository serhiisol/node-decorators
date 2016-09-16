import { readFileSync, readdirSync } from 'fs';
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
    routes: IRoutes = controller.__meta__.routes,
    middleware: IMiddleware = controller.__meta__.middleware,
    baseUrl: string = controller.__meta__.baseUrl,
    params: IParams = controller.__meta__.params;

  for (let methodName in routes) {
    let method: string = routes[methodName].method, fn: Function;

    fn = (req, res, next) => {
      let args = extractParameters(req, res, next, params[methodName]);
      return controller[methodName].apply(controller, args)
    };

    router[method].apply(router, [
      routes[methodName].url, ...(middleware[methodName] || []), fn
    ]);
  }

  app.use(baseUrl, router);

  return app;
}

export function bootstrapExpress(app: Express) {
  app['controller'] = Controller => registerController(app, Controller);
  return app;
};

export function bootstrapControllersFromDirectory(app: Express, folder: string) {
  let controllers: string[] = readdirSync(folder);
  controllers.forEach((name: string) => {
    try {
      let artifacts = name.split('.');
      if (artifacts.pop() === 'js') {
        name = artifacts.join();
        let controller = require(`${folder}/${name}`);
        if (controller.prototype && controller.prototype.__meta__) {
          registerController(app, controller);
        } else if (typeof controller === 'object') {
          for (let key in controller) {
            if (controller.hasOwnProperty(key)) {
              registerController(app, controller[key]);
            }
          }
        }
      }
    } catch(e) {
      console.log(`Cannot register controller ${name}`, e, e.message);
    }
  });
}
