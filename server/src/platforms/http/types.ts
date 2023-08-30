import { Handler, Metadata } from '../../core';

export interface RouteMetadata extends Metadata {
  status?: number;
}

export interface AdapterRoute {
  handler: Handler;
  type: string;
  url: string;
}
