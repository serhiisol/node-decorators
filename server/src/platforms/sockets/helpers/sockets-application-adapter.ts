import { Server } from '../../../core';
import { AdapterEvent } from '../types';
import { ParameterType } from './constants';

export abstract class SocketsApplicationAdapter {
  abstract type: string;
  abstract attachServer(server: Server): void;
  abstract close(): void;
  abstract emit(socket: unknown, event: string, message: unknown): Promise<void> | void;
  abstract events(events: AdapterEvent[]): void;
  abstract getParam(type: ParameterType, index: number, ...args: any[]): Promise<() => unknown> | (() => unknown);
  abstract listen(options?: object): Promise<void> | void;
  abstract set?(setting: string, value: unknown): void;
  abstract use(...args: any[]): void;
}
