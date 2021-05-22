import { RequestHandler, Application, Router, Express, Request, Response, NextFunction } from 'express';
import { Container } from '@decorators/di';

import { ExpressMeta, getMeta, ParameterType, ExpressClass, Route, ParameterConfiguration } from './meta';
import { middlewareHandler, errorMiddlewareHandler, Type } from './middleware';

/**
 * Attach controllers to express application
 *
 * @param {Express} app Express application
 * @param {Type[]} controllers Controllers array
 */
export function attachControllers(app: Express | Router, controllers: Type[]) {
  controllers.forEach((controller: Type) => registerController(app, controller, getController));

  // error middleware must be registered as the very last one
  app.use(errorMiddlewareHandler());
}

/**
 * Attach controller instances to express application
 *
 * @param {Express} app Express application
 * @param {any[]} controllers Controllers array
 */
export function attachControllerInstances(app: Express | Router, controllers: object[]) {
  controllers.forEach((controller: Type) => registerController(app, controller, (c: object) => c));

  // error middleware must be registered as the very last one
  app.use(errorMiddlewareHandler());
}

/**
 * Register controller via registering new Router
 *
 * @param {Application} app
 * @param {ExpressClass} Controller
 * @returns
 */
function registerController(app: Application | Router, Controller: Type|object, _getController: (c: Type|object) => ExpressClass) {
  const controller: ExpressClass = _getController(Controller);
  const meta: ExpressMeta = getMeta(controller);
  const router: Router = Router(meta.routerOptions);
  const routes: { [key: string]: { [key: string]: Route } } = meta.routes;
  const url: string = meta.url;
  const params: object = meta.params;

  /**
   * Wrap all registered middleware with helper function
   * that can instantiate or get from the container instance of the class
   * or execute given middleware function
   * @see getMiddleware
   */
  const routerMiddleware: RequestHandler[] = (meta.middleware || [])
    .map(middleware => middlewareHandler(middleware));

  /**
   * Apply router middleware
   */
  if (routerMiddleware.length) {
    router.use(...routerMiddleware);
  }

  /**
   * Applying registered routes
   */
  for (const methodName of Object.keys(routes)) {
    const routeHandler = (req, res, next) => {
      const args = extractParameters(req, res, next, params[methodName]);
      const handler = controller[methodName].apply(controller, args);

      if (handler instanceof Promise) {
          handler.catch(next);
      }

      return handler;
    };

    const routesMap = routes[methodName];
    Object.values(routesMap).forEach(route => {
      const routeMiddleware: RequestHandler[] = (route.middleware || [])
        .map(middleware => middlewareHandler(middleware));

      router[route.method].apply(router, [
        route.url, ...routeMiddleware, routeHandler
      ]);
    });
  }

  (app as Router).use(url, router);

  return app;
}

/**
 * Extract parameters for handlers
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @param {ParameterConfiguration[]} params
 *
 * @returns {any[]}
 */
function extractParameters(req: Request, res: Response, next: NextFunction, params: ParameterConfiguration[]): any[] {
  if (!params || !params.length) {
    return [ req, res, next ];
  }

  const args = [];

  for (const { name, index, type } of params) {

    switch (type) {
      case ParameterType.RESPONSE:
        args[index] = res;
        break;
      case ParameterType.REQUEST:
        args[index] = getParam(req, null, name);
        break;
      case ParameterType.NEXT:
        args[index] = next;
        break;
      case ParameterType.PARAMS:
        args[index] = getParam(req, 'params', name);
        break;
      case ParameterType.QUERY:
        args[index] = getParam(req, 'query', name);
        break;
      case ParameterType.BODY:
        args[index] = getParam(req, 'body', name);
        break;
      case ParameterType.HEADERS:
        args[index] = getParam(req, 'headers', name);
        break;
      case ParameterType.COOKIES:
        args[index] = getParam(req, 'cookies', name);
        break;
    }

  }

  return args;
}

/**
 * Get controller instance from container or instantiate one
 *
 * @param {any} Controller
 *
 * @returns {ExpressClass}
 */
function getController(Controller: Type): ExpressClass {
  try {
    return Container.get(Controller);
  } catch {
    return new Controller();
  }
}

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
  const param = source[paramType] || source;

  return name ? param[name] : param;
}
