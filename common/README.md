![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

### Common Decorators

### Installation
```
npm install @decorators/common --save
```
### API
* **@Log(fn?: Function)** - Log class, method, property, if function provided, function will accept next parameters:
  * **Class** - *function (className, arguments)*
  * **Method** - *function (className, functionName, arguments)*
  * **Property** - *function (className, propertyName, value, type)* - where *type* = 'set' || 'get'
```typescript
@Log()
class Animal {
  @Log()
  name: string;
  @Log()
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

* **@Debounce(wait: number = 500)** - postpone its execution until after wait milliseconds have elapsed since the last time it was invoked
```typescript
class Animal {
  @Debounce(200)
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

* **@Throttle(wait: number = 500)** - when invoked repeatedly, will only actually call the original function at most once per every wait milliseconds 
```typescript
class Animal {
  @Throttle(200)
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

* **@Decorate(decorateFunction: Function, ...args)** - Decorate class function with given function. 
Decorator function should return new function which will be executed like so:

```typescript
@Decorate(function (originalMethod, ...args) {
  return function newFunctionToCall() => {
    originalMethod.call(this, arguments);
  }
}, arg1, arg2, arg3)
```

```typescript
import { bind } from 'underscore';
class Animal {
  @Decorate(bind, {name: 'moe'}, 'hi')
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

```typescript
import { wrap } from 'underscore';
class Animal {
  @Decorate(wrap, function(func, volume) {
    console.log('Calling sound func', func.call(this, volume));
  })
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

```typescript
import { once } from 'underscore';
class Animal {
  @Decorate(once)
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

* **@SuppressConsole(methods?: string[])** - Suppress console.log or given methods
```typescript
class Animal {
  @SuppressConsole(['log'])
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```

* **@Bind()** - ensure, that the function will be executed with correct scope
```typescript
class Animal {
  name: string;
  @Bind()
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }
}
```
* **@Catch(func: (e) => void)** - Catches unhandled error in the function, passes error in input function
```typescript
class Animal {
  @Catch((e) => {
    console.log(e); //ReferenceError: name is not defined...
  });
  sound(volume: number) {
    console.log(name, ': Auuuu', volume);
  }
}
```


### License
MIT
