import { Middleware } from './middleware';

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

export interface ParameterConfiguration {
  index: number;
  type: ParameterType;
  name?: string;
  data?: any;
}

export interface Route {
  method: string;
  url: string;
  middleware: Middleware | Middleware[];
}

export interface ExpressMeta {
  url: string;

  routes: {
    [key: string]: Route;
  }

  middleware: Middleware | Middleware[];

  params: {
    [key: string]: ParameterConfiguration[];
  }
}

export abstract class ExpressClass {
  abstract __express_meta__?: ExpressMeta;
}

/**
 * Get or initiate metadata on target
 * @param target
 * @returns {SocketIOMeta}
 */
export function getMeta(target: ExpressClass): ExpressMeta {
  if (!target.__express_meta__) {
    target.__express_meta__ = {
      url: '',
      middleware: [],
      routes: {},
      params: {}
    };
  }
  return target.__express_meta__;
}
