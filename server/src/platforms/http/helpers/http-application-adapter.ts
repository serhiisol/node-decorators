import { Server } from 'http';

import { Handler } from '../../../core';
import { ParameterType } from './constants';

export abstract class HttpApplicationAdapter {
  abstract server?: Server;
  abstract close(): void;
  abstract getParam(type: ParameterType, name?: string, ...args: any[]): Promise<unknown> | unknown;
  abstract isHeadersSent(response: unknown): Promise<boolean> | boolean;
  abstract listen(port: number): Promise<void> | void;
  abstract render(response: unknown, template: string, message: unknown): Promise<string> | string;
  abstract reply(response: unknown, message: unknown, statusCode?: number): Promise<unknown> | unknown;
  abstract route(url: string, type: string, handler: Handler): void;
  abstract serveStatic(prefix: string, path: string, options?: unknown): void;
  abstract set(setting: string, value: unknown): void;
  abstract setHeader(response: unknown, name: string, value: string): void;
  abstract use(...args: any[]): void;
}
