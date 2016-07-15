///<reference path="typings/typings.d.ts"/>
import { Express } from 'express';

export * from './decorators';
export * from './express';

export interface DecoratedExpress extends Express {
  controller(Controller): DecoratedExpress;
}
