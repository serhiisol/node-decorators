import { RequestHandler } from 'express';

export type Func = (...args: any[]) => any;

export interface ParameterConfiguration {
  index: number;
  type: any;
  name?: string;
  data?: any;
}

export interface Params {
  [key: string]: ParameterConfiguration[];
}

export interface Route {
  method: string;
  url: string;
}

export interface Routes {
  [key: string]: Route;
}

export interface Middleware {
  [key: string]: RequestHandler[];
}

export interface ExpressMeta {
  baseUrl: string;
  routes: Routes;
  controllerMiddleware: RequestHandler[];
  middleware: Middleware;
  params: Params;
}

export interface ExpressClass extends Object {
  __express_meta__?: ExpressMeta;

  new (...deps: any[]);
}

export enum ParameterType {
  REQUEST,
  RESPONSE,
  PARAMS,
  QUERY,
  BODY,
  HEADERS,
  COOKIES,
  NEXT
}
