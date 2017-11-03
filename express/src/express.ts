import { RequestHandler, ErrorRequestHandler, Application, Router, Express, Request, Response, NextFunction } from 'express';
import { Container, InjectionToken } from '@decorators/di';

import { ExpressMeta, getMeta, ParameterType, ExpressClass, Route, ParameterConfiguration } from './meta';
import { middlewareHandler, Middleware, ErrorMiddleware, ErrorMiddlewareClass } from './middleware';

export const ERROR_MIDDLEWARE = new InjectionToken('ERROR_MIDDLEWARE');

/**
 * Attach controllers to express application
 *
 * @param {Express} app Express application
 * @param {ExpressClass[]} controllers Controllers array
 */
export function attachControllers(app: Express, controllers: ExpressClass[]) {
  controllers.forEach((controller: ExpressClass) => registerController(app, controller));
  applyErrorMiddleware(app);
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

  /**
   * Wrap all registered middleware with helper function
   * that can instantiate or get from the container instance of the class
   * or execute given middleware function
   * @see getMiddleware
   */
  const routerMiddleware: RequestHandler[] = getMiddleware(meta.middleware)
    .map(middleware => middlewareHandler(middleware, controller));

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
    const route: Route = routes[methodName];

    const routeHandler = (req, res, next) => {
      const args = extractParameters(req, res, next, params[methodName]);

      return controller[methodName].apply(controller, args);
    };

    const routeMiddleware: RequestHandler[] = getMiddleware(route.middleware)
      .map(middleware => middlewareHandler(middleware, controller));

    router[route.method].apply(router, [
      route.url, ...routeMiddleware, routeHandler
    ]);
  }

  app.use(url, router);

  return app;
}

/**
 * Add error middleware to the app
 *
 * @param {Express} app
 */
function applyErrorMiddleware(app: Express): void {
  try {
    const errorMiddleware: ErrorMiddleware = Container.get(ERROR_MIDDLEWARE);
    const handler = (errorMiddleware as ErrorMiddlewareClass).use ?
      (errorMiddleware as ErrorMiddlewareClass).use.bind(errorMiddleware) : errorMiddleware as ErrorRequestHandler;

    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
      try {
        handler(error, req, res, next);
      } catch (error) {
        next(error);
      }
    });
  } catch (e) {
    console.info('Error middleware wasn\'t registered');
  }
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

  for (let { name, index, type } of params) {

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
 * Get array of middleware functions or classes
 *
 * @param {Middleware | Middleware[]} middleware
 *
 * @returns {Middleware[]}
 */
function getMiddleware(middleware: Middleware | Middleware[]): Middleware[] {
  if (middleware) {
    return Array.isArray(middleware) ? middleware : [middleware];
  }

  return [];
}
