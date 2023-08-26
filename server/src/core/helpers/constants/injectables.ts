import { InjectionToken } from '@decorators/di';

/**
 * Registers global pipes for entire server
 */
export const GLOBAL_PIPE = new InjectionToken('__server__:global-pipe');
export const ROOT_MODULE = new InjectionToken('__server__:root-module');
export const ROOT_MODULE_INSTANCE = new InjectionToken('__server__:root-module-instance');

/**
 * Provides global application prefix/version for entire server
 */
export const APP_VERSION = new InjectionToken('__server__:app-version');

export const APP_SERVER = new InjectionToken('__server__');
