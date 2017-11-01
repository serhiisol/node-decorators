import { expect } from 'chai';

import { StoreProvider } from './types';
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
      const provider: StoreProvider = Store.findProvider(TestInjectable);

      expect(provider).to.be;
    });

  });

  describe('.providerId(injectable: Injectable)', () => {

    it('should return null, if no injectable given', () => {
      const id: null = <null>Store.providerId(undefined);

      expect(id).to.equal(null);
    });

    it('should return given injectable, if injectable is type of string', () => {
      const token = 'token';
      const id: string = <string>Store.providerId(token);

      expect(id).to.equal(token);
    });

    it('should return given injectable, if injectable is instance of InjectionToken', () => {
      const token: InjectionToken = new InjectionToken('token');
      const id: InjectionToken = <InjectionToken>Store.providerId(token);

      expect(id instanceof InjectionToken).to.be.true;
      expect(id).to.equal(token);
    });

  })

  describe('.provider(type: Type, args: { injectable?, optional?, index? })', () => {
    it('should register dependency', () => {
      const index = 0;
      const depId: InjectionToken = new InjectionToken('test-dep');

      Store.provider(TestInjectable, { index, injectable: depId });
      const provider: StoreProvider = Store.findProvider(TestInjectable);

      expect(provider.deps.length).to.equal(1);
      expect(provider.deps[index].optional).to.not.be.true;
      expect(provider.deps[index].id).to.equal(depId);
      expect(provider.id instanceof InjectionToken).to.be.true;
    });

    it('should register optional dependency', () => {
      const index = 0;
      Store.provider(TestInjectable, { index, optional: true});
      const provider: StoreProvider = Store.findProvider(TestInjectable);

      expect(provider.deps.length).to.equal(1);
      expect(provider.deps[index].optional).to.be.true;
      expect(provider.id instanceof InjectionToken).to.be.true;
    });

    it('should extract arguments from constructor', () => {
      Store.provider(TestInjectable);
      const provider: StoreProvider = Store.findProvider(TestInjectable);

      expect(provider.id instanceof InjectionToken).to.be.true;
      expect(provider.deps.length).to.equal(1);
    });

  });

  describe('.replaceProvider(injectable: Injectable, provider: StoreProvider)', () => {

    it('should find and replace provider', () => {
      const id: InjectionToken = new InjectionToken('test-token');
      Store.provider(TestInjectable);

      expect(Store.providers.length).to.equal(1);

      let provider: StoreProvider = Store.findProvider(TestInjectable);

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
