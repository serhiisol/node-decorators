import { ClassConstructor, Handler } from '../types';

export class Context {
  constructor(
    protected controller: ClassConstructor,
    protected handler: Handler,
  ) { }

  getClass() {
    return this.controller;
  }

  getHandler() {
    return this.handler;
  }
}
