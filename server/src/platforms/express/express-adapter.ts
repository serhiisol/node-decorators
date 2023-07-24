import * as express from 'express';
import { Server } from 'http';

import { Handler } from '../../core';
import { HttpApplicationAdapter, ParameterType } from '../http/helpers';

export class ExpressAdapter implements HttpApplicationAdapter {
  server?: Server;

  constructor(public app: express.Express = express()) { }

  close() {
    this.server?.close();
  }

  getParam(type: ParameterType, name: string, req: express.Request, res: express.Response) {
    switch (type) {
      case ParameterType.BODY: return name ? req.body?.[name] : req.body;
      case ParameterType.COOKIES: return name ? req.cookies?.[name] : req.cookies;
      case ParameterType.HEADERS: return name ? req.headers?.[name] : req.headers;
      case ParameterType.PARAMS: return name ? req.params?.[name] : req.params;
      case ParameterType.QUERY: return name ? req.query?.[name] : req.query;
      case ParameterType.REQUEST: return req;
      case ParameterType.RESPONSE: return res;
      default: return req;
    }
  }

  isHeadersSent(response: express.Response) {
    return response.headersSent;
  }

  listen(port: number) {
    this.server = this.app.listen(port);
  }

  render(response: express.Response, template: string, message: object) {
    response.render(template, message);
  }

  reply(response: express.Response, message: unknown, statusCode?: number) {
    const isJson = typeof message === 'object';

    if (statusCode) {
      response.status(statusCode);
    }

    if (isJson) {
      response.setHeader('Content-Type', 'application/json');

      return response.json(message);
    }

    return response.send(message);
  }

  route(url: string, type: string, handler: Handler) {
    this.app[type]?.(url, handler);
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
