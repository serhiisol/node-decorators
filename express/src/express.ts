import { Router, Express, RequestHandler } from 'express';

import { ParameterType, Routes, Middleware, Injectable, ExpressClass } from './interface';

function getParam(source: any, paramType: string, name: string) {
  let param = source[paramType] || source;
  return param[name] || param;
}

function extractParameters(req, res, next, params): any[] {
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

function registerController(app, Controller, deps) {
  let controller = new Controller(...deps);
  let router: Router = Router();
  let controllerMiddleware: RequestHandler[] = controller.__meta__.controllerMiddleware;
  let routes: Routes = controller.__meta__.routes;
  let middleware: Middleware = controller.__meta__.middleware;
  let baseUrl: string = controller.__meta__.baseUrl;
  let params: Params = controller.__meta__.params;

  if (controllerMiddleware.length) {
    router.use(...controllerMiddleware);
  }

  for (const methodName of Object.keys(routes)) {
    let method: string = routes[methodName].method;
    let fn: Function;

    fn = (req, res, next) => {
      let args = extractParameters(req, res, next, params[methodName]);
      return controller[methodName].apply(controller, args);
    };

    let routeArgs = [
      routes[methodName].url, ...(middleware[methodName] || []), fn
    ];

    router[method].apply(router, routeArgs);
  }

  app.use(baseUrl, router);

  return app;
}

/**
 * Attach controllers to express application
 * @param {Express} app Express application
 * @param {Controller} controllers Controllers array
 */
export function attachControllers(app: Express, injectables: Array<Injectable | ExpressClass>) {
  try {
    injectables
      .forEach((injectable: Injectable | ExpressClass) => {
        const controller = (<Injectable>injectable).provide || <ExpressClass>injectable;
        const deps = (<Injectable>injectable).deps || [];

        registerController(app, controller, deps);
      });
  } catch (e) {
    console.log('Second parameter should be array of injectables: { provide: Controller, deps: any[] }', e, e.message);
  }
}

/**
 * @deprecated
 * @see attachControllers
 */
export let bootstrapControllers = attachControllers;
