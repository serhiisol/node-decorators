import * as Koa from 'koa';
import * as koaMount from 'koa-mount';
import * as KoaRouter from 'koa-router';
import * as koaStatic from 'koa-static';

import { Server } from '../../core';
import { AdapterRoute, HttpApplicationAdapter, ParameterType } from '../http';

export class KoaAdapter implements HttpApplicationAdapter {
  type = 'koa';
  private server: Server;

  constructor(public app = new Koa()) { }

  attachServer(server: Server): void {
    this.server = server;
  }

  close() {
    if (this.server.listening) {
      this.server.close();
    }
  }

  getParam(type: ParameterType, name: string, ctx: Koa.Context) {
    const req = ctx.request;
    const res = ctx.response;

    switch (type) {
      case ParameterType.BODY: return () => name ? req['body']?.[name] : req['body'];
      case ParameterType.COOKIE: return () => name ? ctx.cookies?.get(name) : this.getCookies(ctx);
      case ParameterType.HEADER: return () => name ? ctx.headers?.[name] : ctx.headers;
      case ParameterType.PARAM: return () => name ? ctx.params?.[name] : ctx.params;
      case ParameterType.QUERY: return () => name ? ctx.query?.[name] : ctx.query;
      case ParameterType.REQUEST: return () => req;
      case ParameterType.RESPONSE: return () => res;
      default: return () => req;
    }
  }

  isHeadersSent(response: Koa.Response) {
    return response.headerSent;
  }

  listen() {
    this.server.on('request', this.app.callback());
  }

  async render(response: Koa.Response, template: string, message: object) {
    try {
      const html = await response.ctx.render(template, message);

      return html as unknown as string;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  reply(response: Koa.Response, message: unknown, statusCode?: number) {
    const isJson = typeof message === 'object';

    if (statusCode) {
      response.ctx.status = statusCode;
    }

    if (isJson) {
      this.setHeader(response, 'Content-Type', 'application/json');
    }

    response.ctx.body = message;
  }

  routes(routes: AdapterRoute[]) {
    const router = new KoaRouter();

    for (const route of routes) {
      router[route.type]?.(route.url.replace('*', '(.*)'), route.handler);
    }

    this.app.use(router.routes());
  }

  serveStatic(prefix: string, path: string, options?: unknown) {
    this.app.use(koaMount(prefix, koaStatic(path, options)));
  }

  setHeader(response: Koa.Response, name: string, value: string) {
    response.set(name, value);
  }

  use(...args: any[]) {
    this.app.use.call(this.app, ...args);
  }

  private getCookies(ctx: Koa.Context) {
    return ctx.headers.cookie
      .split(';')
      .reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split('=');

        return { ...acc, [name]: value };
      }, {});
  }
}
