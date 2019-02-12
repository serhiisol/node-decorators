/**
 * Clone class properties correctly to target, getters and setters will be copied as well
 * @param {object} obj Original Object
 * @param {object} target Target Object
 */
function cloneClass(obj: object, target: object): object {
  let statics: string[] = Object.getOwnPropertyNames(obj);
  for (let key of statics) {
    let descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
    if (descriptor) {
      Reflect.defineProperty(target, key, descriptor);
    } else {
      target[key] = obj[key];
    }
  }
  return target;
}

/**
 * Log class
 * @param {Function} [loggerFn] Logger function to execute, instead of native log
 */
function LogClass(loggerFn?: (...args) => void) {

  return function(OriginalClass) {
    const className = OriginalClass.name;

    function CopyClass(...args) {
      const logArgs = args.map(arg => JSON.stringify(arg)).join(', ');

      if (loggerFn) {
        loggerFn(className, args);
      } else {
        console.log(`LogClass: new ${className}(${logArgs})`);
      }

      return new OriginalClass(...args);
    }

    return cloneClass(OriginalClass, CopyClass);
  };

}

/**
 * Log method
 * @param {Function} [loggerFn] Logger function to execute, instead of native log
 */
function LogMethod(loggerFn?: (...args) => void) {
  return function(target, key, descriptor) {
    const className = target.constructor.name;
    const originalMethod = descriptor.value;

    descriptor.value = function(...args) {
      const logArgs = args.join(', ');
      const result = originalMethod.apply(this, args);

      if (loggerFn) {
        loggerFn(className, key, args);
      } else {
        console.log(`LogMethod: ${className}.${key}(${logArgs}) =>`, JSON.stringify(result));
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Log property
 * @param {Function} [loggerFn] Logger function to execute, instead of native log
 */
function LogProperty(loggerFn?: (...args) => void) {
  return function(
    target: any,
    key: string,
    descriptor: PropertyDescriptor = Object.getOwnPropertyDescriptor(target, key)
  ) {
    const className = target.constructor.name;
    const _get = descriptor ? descriptor.get : null;
    const _set = descriptor ? descriptor.set : null;
    let value = !descriptor ? target[key] : null;

    function getter() {
      const val = descriptor ? _get.call(this) : value;

      if (loggerFn) {
        loggerFn(className, key, val, 'get');
      } else {
        console.log(`LogProperty_Get: ${className}.${key} => ${val}`);
      }

      return val;
    }

    function setter(val) {
      if (loggerFn) {
        loggerFn(className, key, val, 'set');
      } else {
        console.log(`LogProperty_Set: ${className}.${key} => ${val}`);
      }

      if (descriptor) {
        return _set.call(this, val);
      }
      value = val;
    }

    if (descriptor) {
      descriptor.get = getter;
      descriptor.set = setter;
    } else {
      Object.defineProperty(target, key, {
        enumerable: true,
        configurable: true,
        get: getter,
        set: setter
      });
    }
  };
}

/**
 * Log function, generic function to log different types of class members
 * @param {Function} [loggerFn] Logger function to execute, instead of native log
 */
export function Log(loggerFn?: (...args) => void) {
  return function(...args: any[]) {
    switch (args.length) {
      case 1:
        return LogClass(loggerFn).apply(this, args);
      case 2:
        return LogProperty(loggerFn).apply(this, args);
      case 3:
        if (args[2] === undefined || typeof args[2].value !== 'function') {
          return LogProperty(loggerFn).apply(this, args);
        }
        return LogMethod(loggerFn).apply(this, args);
      default:
        console.log('@Log works only as Class, Method and Property decorators.');
        throw new Error('Try to use');
    }
  };
}
