import { Router, Express, RequestHandler, Request, Response, NextFunction } from 'express';
import { Container } from '@decorators/di';

import {
  Func,
  ParameterType,
  Routes,
  Middleware,
  ExpressClass,
  Params,
  ExpressMeta
} from './interface';
import { getMeta } from './meta';

function getParam(source: any, paramType: string, name: string) {
  let param = source[paramType] || source;

  return param[name] || param;
}

function extractParameters(
  req: Request,
  res: Response,
  next: NextFunction,
  params: any[]
): any[] {
  let args = [];
  if (!params || !params.length) {
    return [req, res, next];
  }
  for (let item of params) {

    switch (item.type) {
      default: args[item.index] = res; break; // response
      case ParameterType.REQUEST: args[item.index] = getParam(req, null, item.name); break;
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
  const controller: ExpressClass = Container.get(Controller);
  const meta: ExpressMeta = getMeta(controller);
  const router: Router = Router();
  const controllerMiddleware: RequestHandler[] = controller.__express_meta__.controllerMiddleware;
  const routes: Routes = controller.__express_meta__.routes;
  const middleware: Middleware = controller.__express_meta__.middleware;
  const baseUrl: string = controller.__express_meta__.baseUrl;
  const params: Params = controller.__express_meta__.params;

  if (controllerMiddleware.length) {
    router.use(...controllerMiddleware);
  }

  for (const methodName of Object.keys(routes)) {
    const method: string = routes[methodName].method;
    let fn: Func = (req, res, next) => {
      const args = extractParameters(req, res, next, params[methodName]);

      return controller[methodName].apply(controller, args);
    };

    const routeArgs = [
      routes[methodName].url, ...(middleware[methodName] || []), fn
    ];

    router[method].apply(router, routeArgs);
  }

  app.use(baseUrl, router);

  return app;
}

/**
 * Attach controllers to express application
 *
 * @param {Express} app Express application
 * @param {ExpressClass[]} controllers Controllers array
 */
export function attachControllers(app: Express, controllers: ExpressClass[]) {
  controllers
    .forEach((controller: ExpressClass) => {
      registerController(app, controller);
    });
}
