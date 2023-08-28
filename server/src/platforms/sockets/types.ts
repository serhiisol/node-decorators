import { Handler, Metadata } from '../../core';

export type AckFunction = (...args: any[]) => void;

export interface EventMetadata extends Metadata {
  event?: string;
}

export interface AdapterEvent {
  event: string;
  handler: Handler;
  type: string;
  url: string;
}
