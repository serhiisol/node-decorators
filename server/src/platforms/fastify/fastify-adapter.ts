import * as FastifyStatic from '@fastify/static';
import * as Fastify from 'fastify';

import { Server } from '../../core';
import { AdapterRoute, HttpApplicationAdapter, ParameterType } from '../http';

export class FastifyAdapter implements HttpApplicationAdapter {
  type = 'fastify';
  private server: Server;

  constructor(public app = Fastify()) { }

  attachServer(server: Server) {
    this.server = server;
  }

  async close() {
    await this.app.close();
  }

  getParam(type: ParameterType, name: string, req: Fastify.FastifyRequest, res: Fastify.FastifyReply) {
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

  isHeadersSent(response: Fastify.FastifyReply) {
    return response.sent;
  }

  async listen() {
    await this.app.ready();
    this.server.on('request', this.app.routing);
  }

  render(_response: Fastify.FastifyReply, template: string, message: object) {
    return new Promise<string>((resolve, reject) => (this.app as any).view(template, message,
      (err: Error, html: string) => err || html?.['stack']
        ? reject(new Error((err || html).toString()))
        : resolve(html),
    ));
  }

  reply(response: Fastify.FastifyReply, message: unknown, statusCode?: number) {
    const isJson = typeof message === 'object';

    if (statusCode) {
      response.code(statusCode) as unknown;
    }

    if (isJson) {
      this.setHeader(response, 'Content-Type', 'application/json') as unknown;
    }

    return response.send(message);
  }

  routes(routes: AdapterRoute[]) {
    for (const route of routes) {
      this.app[route.type]?.(route.url, route.handler);
    }
  }

  serveStatic(prefix: string, path: string, options?: object) {
    this.app.register(FastifyStatic, {
      decorateReply: false,
      prefix,
      redirect: true,
      root: path,
      ...options,
    } as any) as unknown;
  }

  setHeader(response: Fastify.FastifyReply, name: string, value: string) {
    response.header(name, value) as unknown;
  }

  use(...args: any[]) {
    this.app.register(args[0], args[1]) as unknown;
  }
}
