import { expect } from 'chai';

import { Store } from './store';
import { InjectionToken } from './injection-token';
import { Injectable } from './decorators';

@Injectable()
class TestInjectable {
  constructor(public str: string) {}
}

describe('Store', () => {

  beforeEach(() => Store.providers = []);

  describe('.findProvider(injectable: Injectable)', () => {

    it('should find provider', () => {
      Store.provider(TestInjectable);
      const provider = Store.findProvider(TestInjectable);

      expect(provider).to.be;
    });

  });

  describe('.providerId(injectable: Injectable)', () => {

    it('should return null, if no injectable given', () => {
      const id = Store.providerId(undefined) as null;

      expect(id).to.equal(null);
    });

    it('should return given injectable, if injectable is type of string', () => {
      const token = 'token';
      const id = Store.providerId(token) as string;

      expect(id).to.equal(token);
    });

    it('should return given injectable, if injectable is instance of InjectionToken', () => {
      const token = new InjectionToken('token');
      const id = Store.providerId(token) as InjectionToken;

      expect(id instanceof InjectionToken).to.be.true;
      expect(id).to.equal(token);
    });

  });

  describe('.provider(type: Type, args: { injectable?, optional?, index? })', () => {
    it('should register dependency', () => {
      const index = 0;
      const depId = new InjectionToken('test-dep');

      Store.provider(TestInjectable, { index, injectable: depId });
      const provider = Store.findProvider(TestInjectable);

      expect(provider.deps.length).to.equal(1);
      expect(provider.deps[index].optional).to.not.be.true;
      expect(provider.deps[index].id).to.equal(depId);
      expect(provider.id instanceof InjectionToken).to.be.true;
    });

    it('should register optional dependency', () => {
      const index = 0;
      Store.provider(TestInjectable, { index, optional: true});
      const provider = Store.findProvider(TestInjectable);

      expect(provider.deps.length).to.equal(1);
      expect(provider.deps[index].optional).to.be.true;
      expect(provider.id instanceof InjectionToken).to.be.true;
    });

    it('should extract arguments from constructor', () => {
      Store.provider(TestInjectable);
      const provider = Store.findProvider(TestInjectable);

      expect(provider.id instanceof InjectionToken).to.be.true;
      expect(provider.deps.length).to.equal(1);
    });

  });

  describe('.replaceProvider(injectable: Injectable, provider)', () => {

    it('should find and replace provider', () => {
      const id = new InjectionToken('test-token');
      Store.provider(TestInjectable);

      expect(Store.providers.length).to.equal(1);

      let provider = Store.findProvider(TestInjectable);

      expect(provider).to.be;

      Store.replaceProvider(TestInjectable, { id });

      expect(Store.providers.length).to.equal(1);

      provider = Store.findProvider(id);

      expect(Store.providers[0]).to.equal(provider);
      expect(Store.providers.length).to.equal(1);
      expect(provider.id).to.equal(id);
    });

  });

});
