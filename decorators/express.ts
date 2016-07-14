import { Router } from 'express';
import * as express from 'express';

function compare(a, b) {
  if (a.index < b.index) {
    return -1;
  } else if (a.index > b.index) {
    return 1;
  }
  return 0;
}

function extractParameters(req, res, params) {
  let args = [];
  params = params.sort(compare);

  for (let item of params) {
    if (item.type === 'request') {
      args.push(req);
    }
    if (item.type === 'response') {
      args.push(res);
    }
  }

  return args;
}

export let App = () => {

  let app: any = express();

  app['controller'] = Controller => {
    let controller = new Controller(),
      router = Router(),
      routes = controller.__meta__.routes,
      middleware = controller.__meta__.middleware,
      baseUrl = controller.__meta__.baseUrl,
      params = controller.__meta__.params;

    for (let methodName in routes) {
      let method = routes[methodName].method, fn;

      fn = (req, res) => {
        let args = extractParameters(req, res, params[methodName]);
        return controller[methodName].apply(controller, args)
      };


      router[method].apply(router, [
        routes[methodName].url, ...middleware[methodName], fn
      ]);
    }

    app.use(baseUrl, router);

    return app;
  };

  return app;

};
