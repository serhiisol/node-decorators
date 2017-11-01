import { RequestHandler, Application, Router, Express, Request, Response, NextFunction } from 'express';
import { Container } from '@decorators/di';

import { ExpressMeta, getMeta, ParameterType, ExpressClass } from './meta';
import { getMiddleware } from './middleware';

/**
 * Get parameter value from the source object
 *
 * @param {*} source
 * @param {string} paramType
 * @param {string} name
 *
 * @returns {*}
 */
function getParam(source: any, paramType: string, name: string): any {
  let param = source[paramType] || source;

  return param[name] || param;
}

/**
 * Extract parameters for handlers
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {any[]} params
 *
 * @returns {any[]}
 */
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

/**
 * Register controller via registering new Router
 *
 * @param {Application} app
 * @param {ExpressClass} Controller
 * @returns
 */
function registerController(app: Application, Controller: ExpressClass) {
  const controller: ExpressClass = Container.get(Controller);
  const meta: ExpressMeta = getMeta(controller);
  const router: Router = Router();

  const routes: object = meta.routes;
  const url: string = meta.url;
  const params: object = meta.params;

  const routerMiddleware: RequestHandler[] = meta.routerMiddleware
    .map((_middleware) => getMiddleware(_middleware));
  const routeMiddleware = meta.routeMiddleware

  if (routerMiddleware.length) {
    router.use(...routerMiddleware);
  }

  for (const methodName of Object.keys(routes)) {
    const method: string = routes[methodName].method;
    const routeHandler = (req, res, next) => {
      const args = extractParameters(req, res, next, params[methodName]);

      return controller[methodName].apply(controller, args);
    };

    const normalizedRouteMiddleware: RequestHandler[] = (routeMiddleware[methodName] || [])
      .map((_middleware) => getMiddleware(_middleware));

    router[method].apply(router, [
      routes[methodName].url, ...normalizedRouteMiddleware, routeHandler
    ]);
  }

  app.use(url, router);

  return app;
}

/**
 * Attach controllers to express application
 *
 * @param {Express} app Express application
 * @param {ExpressClass[]} controllers Controllers array
 */
export function attachControllers(app: Express, controllers: ExpressClass[]) {
  controllers.forEach((controller: ExpressClass) => registerController(app, controller));
}
