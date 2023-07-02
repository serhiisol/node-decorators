import 'reflect-metadata';
import { Container } from './container';
import { InjectionToken } from './injection-token';
import { Injectable, Inject } from './decorators';
import { InvalidDependencyError, MissingDependencyError, RecursiveDependencyError } from './errors';

describe('Container', () => {
  let extraContainer: Container;
  let container: Container;

  beforeEach(() => {
    extraContainer = new Container();
    container = new Container();
    container.setParent(extraContainer);
  });

  describe('ValueProvider', () => {
    it('registers a provider', async () => {
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, useValue: 1 },
      ]);

      expect(await container.get(token)).toEqual(1);
    });

    it('replaces a provider', async () => {
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, useValue: 1 },
        { provide: token, useValue: 2 },
      ]);

      expect(await container.get(token)).toEqual(2);
    });
  });

  describe('FactoryProvider', () => {
    it('registers a provider', async () => {
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, useFactory: () => 1 },
      ]);

      expect(await container.get(token)).toEqual(1);
    });

    it('replaces a provider', async () => {
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, useFactory: () => 1 },
      ]);

      await container.get(token);

      container.provide([
        { provide: token, useFactory: () => 2 },
      ]);

      expect(await container.get(token)).toEqual(2);
    });

    it('creates a provider with deps', async () => {
      const dep = new InjectionToken('dep');
      const token = new InjectionToken('token');

      container.provide([
        { provide: dep, useValue: 1 },
        { provide: token, deps: [dep], useFactory: val => val },
      ]);

      expect(await container.get(token)).toEqual(1);
    });

    it('throwss a {MissingDependencyError} error', async () => {
      const dep = new InjectionToken('dep');
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, deps: [dep], useFactory: (val) => val },
      ]);

      try {
        await container.get(token);
      } catch (error) {
        expect(error).toBeInstanceOf(MissingDependencyError);
      }
    });

    it('throwss a {RecursiveDependencyError} error', async () => {
      const dep = new InjectionToken('dep');
      const token = new InjectionToken('token');

      container.provide([
        { provide: dep, deps: [token], useFactory: (val) => val },
        { provide: token, deps: [dep], useFactory: (val) => val },
      ]);

      try {
        await container.get(token);
      } catch (error) {
        expect(error).toBeInstanceOf(RecursiveDependencyError);
      }
    });
  });

  describe('ClassProvider', () => {
    it('registers a provider', async () => {
      @Injectable()
      class TestInjectable {}

      container.provide([
        { provide: TestInjectable, useClass: TestInjectable },
      ]);

      expect(await container.get(TestInjectable)).toBeInstanceOf(TestInjectable);
    });

    it('replaces a provider', async () => {
      @Injectable()
      class TestInjectable {}

      @Injectable()
      class AnotherInjectable {}

      container.provide([
        { provide: TestInjectable, useClass: TestInjectable },
      ]);

      await container.get(TestInjectable);

      container.provide([
        { provide: TestInjectable, useClass: AnotherInjectable },
      ]);

      expect(await container.get(TestInjectable)).toBeInstanceOf(AnotherInjectable);
    });

    it('creates a provider with deps', async () => {
      const dep = new InjectionToken('dep');

      @Injectable()
      class TestInjectable {
        constructor(@Inject(dep) public number: number) { }
      }

      container.provide([
        { provide: dep, useFactory: () => 1 },
        { provide: TestInjectable, useClass: TestInjectable },
      ]);

      const provider = await container.get<TestInjectable>(TestInjectable);

      expect(provider).toBeInstanceOf(TestInjectable);
      expect(provider.number).toEqual(1);
    });

    it('throws a {MissingDependencyError} error', async () => {
      const dep = new InjectionToken('dep');

      @Injectable()
      class TestInjectable {
        constructor(@Inject(dep) public number: number) { }
      }

      container.provide([
        { provide: TestInjectable, useClass: TestInjectable, deps: [dep] },
      ]);

      try {
        await container.get(TestInjectable);
      } catch (error) {
        expect(error).toBeInstanceOf(MissingDependencyError);
      }
    });

    it('throws a {RecursiveDependencyError} error', async () => {
      const token = new InjectionToken('token');
      const dep = new InjectionToken('dep');

      @Injectable()
      class TestInjectable {
        constructor(@Inject(dep) public number: number) { }
      }

      @Injectable()
      class AnotherInjectable {
        constructor(@Inject(token) public number: number) { }
      }

      container.provide([
        { provide: token, useClass: TestInjectable },
        { provide: dep, useClass: AnotherInjectable },
      ]);

      try {
        await container.get(token);
      } catch (error) {
        expect(error).toBeInstanceOf(RecursiveDependencyError);
      }
    });

    it('throws a {InvalidDependencyError} error', async () => {
      const dep = new InjectionToken('dep');

      @Injectable()
      class TestInjectable {
        constructor(@Inject(dep) public number: number) { }
      }

      container.provide([
        { provide: TestInjectable, useClass: TestInjectable, deps: [dep] },
      ]);

      try {
        await container.get(TestInjectable);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidDependencyError);
      }
    });
  });

  describe('ExistingProvider', () => {
    it('registers a provider for existing value', async () => {
      const dep = new InjectionToken('dep');
      const token = new InjectionToken('token');

      container.provide([
        { provide: dep, useValue: 1 },
        { provide: token, useExisting: dep },
      ]);

      expect(await container.get(token)).toEqual(1);
    });

    it('registers a provider for existing factory', async () => {
      const dep = new InjectionToken('dep');
      const token = new InjectionToken('token');

      container.provide([
        { provide: dep, useFactory: () => 1 },
        { provide: token, useExisting: dep },
      ]);

      expect(await container.get(token)).toEqual(1);
    });

    it('registers a provider for existing class', async () => {
      @Injectable()
      class TestInjectable {}

      const token = new InjectionToken('token');

      container.provide([
        { provide: TestInjectable, useClass: TestInjectable },
        { provide: token, useExisting: TestInjectable },
      ]);

      expect(await container.get(token)).toBeInstanceOf(TestInjectable);
    });
  });

  describe('MultiProvider', () => {
    it('registers a multi provider for a value', async () => {
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, useValue: 1, multi: true },
        { provide: token, useValue: 2, multi: true },
        { provide: token, useValue: 3, multi: true },
      ]);

      expect(await container.get(token)).toEqual([1, 2, 3]);
    });

    it('registers a multi provider for a factory', async () => {
      const token = new InjectionToken('token');

      container.provide([
        { provide: token, useFactory: () => 1, multi: true },
        { provide: token, useFactory: () => 2, multi: true },
        { provide: token, useFactory: () => 3, multi: true },
      ]);

      expect(await container.get(token)).toEqual([1, 2, 3]);
    });

    it('registers a multi provider for a class', async () => {
      const token = new InjectionToken('token');

      @Injectable()
      class TestInjectable {}

      container.provide([
        { provide: token, useClass: TestInjectable, multi: true },
        { provide: token, useClass: TestInjectable, multi: true },
        { provide: token, useClass: TestInjectable, multi: true },
      ]);

      const value = await container.get(token);

      expect(value[0]).toBeInstanceOf(TestInjectable);
      expect(value[1]).toBeInstanceOf(TestInjectable);
      expect(value[2]).toBeInstanceOf(TestInjectable);
    });

    it('registers a multi provider for a mix of providers', async () => {
      const token = new InjectionToken('token');

      @Injectable()
      class TestInjectable {}

      container.provide([
        { provide: token, useValue: 1, multi: true },
        { provide: token, useFactory: () => 2, multi: true },
        { provide: token, useClass: TestInjectable, multi: true },
      ]);

      const value = await container.get(token);

      expect(value[0]).toEqual(1);
      expect(value[1]).toEqual(2);
      expect(value[2]).toBeInstanceOf(TestInjectable);
    });
  });

  describe('With ExtraContainer', () => {
    it('registers a provider with parent container dependency', async () => {
      const dep = new InjectionToken('dep');
      const token = new InjectionToken('token');

      extraContainer.provide([
        { provide: dep, useValue: 1 },
      ]);

      container.provide([
        { provide: token, useFactory: val => val, deps: [dep] },
      ]);

      expect(await container.get(token)).toEqual(1);
    });
  });
});
