import { Server } from 'http';

import { Route } from '../types';
import { ParameterType } from './constants';

export abstract class HttpApplicationAdapter {
  abstract server?: Server;
  abstract type: string;
  abstract close(): void;
  abstract getParam(type: ParameterType, name?: string, ...args: any[]): Promise<() => unknown> | (() => unknown);
  abstract isHeadersSent(response: unknown): Promise<boolean> | boolean;
  abstract listen(port: number): Promise<void> | void;
  abstract render(response: unknown, template: string, message: unknown): Promise<string> | string;
  abstract reply(response: unknown, message: unknown, statusCode?: number): Promise<unknown> | unknown;
  abstract routes(routes: Route[]): void;
  abstract serveStatic(prefix: string, path: string, options?: object): void;
  abstract set?(setting: string, value: unknown): void;
  abstract setHeader(response: unknown, name: string, value: string): void;
  abstract use(...args: any[]): void;
}
