import * as express from 'express';
import { Server } from 'http';

import { Handler, ParameterType } from '../../core';
import { HttpApplicationAdapter, HttpParameterType } from '../http/helpers';

export class ExpressAdapter implements HttpApplicationAdapter {
  protected app = express();
  protected server?: Server;

  close() {
    this.server?.close();
  }

  getParam(type: ParameterType | HttpParameterType, name: string, req: express.Request, res: express.Response) {
    switch (type) {
      case HttpParameterType.REQUEST: return req;
      case HttpParameterType.RESPONSE: return res;
      case ParameterType.BODY: return req.body && name ? req.body[name] : req.body;
      case ParameterType.PARAMS: return name ? req.params[name] : req.params;
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
    this.app[type](url, handler);
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
