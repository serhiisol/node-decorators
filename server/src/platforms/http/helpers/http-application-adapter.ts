import { Handler, ParameterType } from '../../../core';
import { HttpParameterType } from './constants';

export abstract class HttpApplicationAdapter {
  abstract close(): void;
  abstract getParam(type: ParameterType | HttpParameterType, name?: string, ...args: any[]): unknown;
  abstract isHeadersSent(response: unknown): boolean;
  abstract listen(port: number): Promise<void> | void;
  abstract render(response: unknown, template: string, message: unknown): Promise<unknown> | unknown;
  abstract reply(response: unknown, message: unknown, statusCode: number): Promise<unknown> | unknown;
  abstract route(url: string, type: string, handler: Handler): void;
  abstract set(setting: string, value: unknown): void;
  abstract setHeader(response: unknown, name: string, value: string): void;
  abstract use(...args: any[]): void;
}
