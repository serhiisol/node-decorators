import * as FastifyStatic from '@fastify/static';
import * as Fastify from 'fastify';
import { Server } from 'http';

import { Handler } from '../../core';
import { HttpApplicationAdapter, ParameterType } from '../http/helpers';

export class FastifyAdapter implements HttpApplicationAdapter {
  server?: Server;
  type = 'fastify';

  constructor(public app: Fastify.FastifyInstance = Fastify()) { }

  close() {
    this.server?.close();
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

  async listen(port: number) {
    await this.app.listen({ port });

    this.server = this.app.server;
  }

  render(_response: Fastify.FastifyReply, template: string, message: object) {
    return new Promise<string>((resolve, reject) => (this.app as any).view(template, message,
      (err: Error, html: string) => err ? reject(err) : resolve(html),
    ));
  }

  reply(response: Fastify.FastifyReply, message: unknown, statusCode?: number) {
    const isJson = typeof message === 'object';

    if (statusCode) {
      response.code(statusCode) as unknown;
    }

    if (isJson) {
      response.header('Content-Type', 'application/json') as unknown;
    }

    return response.send(message);
  }

  route(url: string, type: string, handler: Handler) {
    this.app[type]?.(url, handler);
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
