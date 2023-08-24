import * as express from 'express';
import { Server } from 'http';

import { HttpApplicationAdapter, ParameterType } from '../http/helpers';
import { Route } from '../http/types';

export class ExpressAdapter implements HttpApplicationAdapter {
  server?: Server;
  type = 'express';

  constructor(public app: express.Express = express()) { }

  close() {
    this.server?.close();
  }

  getParam(type: ParameterType, name: string, req: express.Request, res: express.Response) {
    switch (type) {
      case ParameterType.BODY: return () => name ? req.body?.[name] : req.body;
      case ParameterType.COOKIE: return () => name ? req.cookies?.[name] : req.cookies;
      case ParameterType.HEADER: return () => name ? req.headers?.[name] : req.headers;
      case ParameterType.PARAM: return () => name ? req.params?.[name] : req.params;
      case ParameterType.QUERY: return () => name ? req.query?.[name] : req.query;
      case ParameterType.REQUEST: return () => req;
      case ParameterType.RESPONSE: return () => res;
      default: return () => req;
    }
  }

  isHeadersSent(response: express.Response) {
    return response.headersSent;
  }

  listen(port: number) {
    this.server = this.app.listen(port);
  }

  render(response: express.Response, template: string, message: object) {
    return new Promise<string>((resolve, reject) => response.render(template, message,
      (err, html) => err ? reject(err) : resolve(html),
    ));
  }

  reply(response: express.Response, message: unknown, statusCode?: number) {
    const isJson = typeof message === 'object';

    if (statusCode) {
      response.status(statusCode);
    }

    if (isJson) {
      this.setHeader(response, 'Content-Type', 'application/json');

      return response.json(message);
    }

    return response.send(message);
  }

  routes(routes: Route[]) {
    for (const route of routes) {
      this.app[route.type]?.(route.url, route.handler);
    }
  }

  serveStatic(prefix: string, path: string, options?: unknown) {
    this.app.use(prefix, express.static(path, options));
  }

  set(setting: string, value: unknown) {
    this.app.set(setting, value);
  }

  setHeader(response: express.Response, name: string, value: string) {
    response.setHeader(name, value);
  }

  use(...args: any[]) {
    this.app.use(...args);
  }
}
