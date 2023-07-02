import { Injectable } from '../types';
import { injectableToString } from '../helpers';

export class MissingProviderError extends Error {
  constructor(injectable: Injectable) {
    super(injectableToString(injectable));
  }
}
