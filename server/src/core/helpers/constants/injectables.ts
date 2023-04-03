import { InjectionToken } from '@decorators/di';

export const GLOBAL_PIPE = new InjectionToken('__server__:global-pipe');
export const ROOT_MODULE = new InjectionToken('__server__:root-module');
export const ROOT_MODULE_INSTANCE = new InjectionToken('__server__:root-module-instance');
export const APP_VERSION = new InjectionToken('__server__:app-version');
