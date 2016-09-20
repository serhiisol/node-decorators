import { Express } from 'express';

export interface DecoratedExpress extends Express {
  controller(Controller):DecoratedExpress;
}

export function bootstrapExpress(app:Express):DecoratedExpress;

export function Controller(baseUrl:string):ClassDecorator;

export function Middleware(middleware:Function):MethodDecorator;

export function Get(url:string):MethodDecorator;

export function Post(url:string):MethodDecorator;

export function Put(url:string):MethodDecorator;

export function Delete(url:string):MethodDecorator;

export function Options(url:string):MethodDecorator;

export function Request(name?:string):ParameterDecorator;

export function Response(name?:string):ParameterDecorator;

export function Params(name?:string):ParameterDecorator;

export function Query(name?:string):ParameterDecorator;

export function Body(name?:string):ParameterDecorator;

export function Headers(name?:string):ParameterDecorator;

export function Cookies(name?:string):ParameterDecorator;
