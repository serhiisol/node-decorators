import { expect } from 'chai';

import { StoreProvider } from './types';
import { Store } from './store';
import { Container } from './container';
import { InjectionToken } from './injection-token';
import { Injectable } from './decorators';
import { MissingProviderError, RecursiveProviderError } from './errors';

@Injectable()
class TestInjectable {
  constructor(public str: string) {}
}

@Injectable()
class AnotherInjectable {
  constructor(public str: string) {}
}

describe('Container', () => {

  beforeEach(() => Store.providers = []);

  describe('.provide(provider: Providers[])', () => {

    describe('ValueProvider', () => {

      it('should register provider', () => {
        const token: InjectionToken = new InjectionToken('token');

        Container.provide([
          { provide: token, useValue: 1 }
        ]);

        expect(Store.providers.length).to.equal(1);

        const provider: StoreProvider = Store.findProvider(token);

        expect(provider.id).to.equal(token);
        expect(provider.value).to.equal(1);
      });

      it('should replace provider', () => {
        const token: InjectionToken = new InjectionToken('token');

        Container.provide([
          { provide: token, useValue: 1 },
          { provide: token, useValue: 2 }
        ]);

        expect(Store.providers.length).to.equal(1);

        const provider: StoreProvider = Store.findProvider(token);

        expect(provider.id).to.equal(token);
        expect(provider.value).to.equal(2);
      });

    });

    describe('FactoryProvider', () => {

      it('should register provider', () => {
        const token: InjectionToken = new InjectionToken('token');
        const factory = () => 1;

        Container.provide([
          { provide: token, useFactory: factory }
        ]);

        expect(Store.providers.length).to.equal(1);

        const provider: StoreProvider = Store.findProvider(token);

        expect(provider.id).to.equal(token);
        expect(provider.factory).to.equal(factory);
      });

      it('should replace provider', () => {
        const token: InjectionToken = new InjectionToken('token');
        const factory = () => 1;
        const factory2 = () => 2;

        Container.provide([
          { provide: token, useFactory: factory },
          { provide: token, useFactory: factory2 }
        ]);

        expect(Store.providers.length).to.equal(1);

        const provider: StoreProvider = Store.findProvider(token);

        expect(provider.id).to.equal(token);
        expect(provider.factory).to.equal(factory2);
      });

      it('should create provider with deps', () => {
        const token: InjectionToken = new InjectionToken('token');
        const dep: InjectionToken = new InjectionToken('dep');

        Container.provide([
          { provide: dep, useValue: 1 },
          { provide: token, deps: [dep], useFactory: (val) => val }
        ]);

        const provider = Container.get(token);
        expect(provider).to.equal(1);
      });

      it('should throw error {MissingProviderError}', () => {
        const token: InjectionToken = new InjectionToken('token');
        const dep: InjectionToken = new InjectionToken('dep');

        Container.provide([
          { provide: token, deps: [dep], useFactory: (val) => val }
        ]);

        try {
          Container.get(token);
        } catch (error) {
          expect(error).to.be;
          expect(error instanceof MissingProviderError).to.be.true;
        }
      });

      it('should throw error {RecursiveProviderError}', () => {
        const token: InjectionToken = new InjectionToken('token');
        const dep: InjectionToken = new InjectionToken('dep');

        Container.provide([
          { provide: token, deps: [dep], useFactory: (val) => val },
          { provide: dep, deps: [token], useFactory: (val) => val },
        ]);

        try {
          Container.get(token);
        } catch (error) {
          expect(error).to.be;
          expect(error instanceof RecursiveProviderError).to.be.true;
        }
      });

    });

    describe('ClassProvider', () => {

      it('should register provider', () => {
        const token: InjectionToken = new InjectionToken('token');
        Container.provide([
          { provide: token, useClass: TestInjectable }
        ]);

        expect(Store.providers.length).to.equal(1);

        const provider: StoreProvider = Store.findProvider(token);

        expect(provider.id).to.equal(token);
        expect(provider.type).to.equal(TestInjectable);
      });

      it('should replace provider', () => {
        const token: InjectionToken = new InjectionToken('token');

        Container.provide([
          { provide: token, useClass: TestInjectable },
          { provide: token, useClass: AnotherInjectable }
        ]);

        expect(Store.providers.length).to.equal(1);

        const provider: StoreProvider = Store.findProvider(token);

        expect(provider.id).to.equal(token);
        expect(provider.type).to.equal(AnotherInjectable);
      });

      it('should create provider with deps', () => {
        const token: InjectionToken = new InjectionToken('token');
        const dep: InjectionToken = new InjectionToken('dep');

        Container.provide([
          { provide: dep, useValue: 'test' },
          { provide: token, useClass: TestInjectable, deps: [dep] }
        ]);

        const provider = Container.get(token);

        expect(provider instanceof TestInjectable).to.be.true;
        expect((provider as TestInjectable).str).to.equal('test');
      });

      it('should throw error {MissingProviderError}', () => {
        const token: InjectionToken = new InjectionToken('token');
        const dep: InjectionToken = new InjectionToken('dep');

        Container.provide([
          { provide: token, useClass: TestInjectable, deps: [dep] }
        ]);

        try {
          Container.get(token);
        } catch (error) {
          expect(error).to.be;
          expect(error instanceof MissingProviderError).to.be.true;
        }
      });

      it('should throw error {RecursiveProviderError}', () => {
        const token: InjectionToken = new InjectionToken('token');
        const dep: InjectionToken = new InjectionToken('dep');

        Container.provide([
          { provide: token, useClass: TestInjectable, deps: [dep] },
          { provide: dep, useClass: AnotherInjectable, deps: [token] }
        ]);

        try {
          Container.get(token);
        } catch (error) {
          expect(error).to.be;
          expect(error instanceof RecursiveProviderError).to.be.true;
        }
      });

    });

  });

});
