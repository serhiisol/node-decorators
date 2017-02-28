# Common#1.1.0
* Moved project back to es5
* **@Catch()** now accepts all passed arguments of the original function and error, e.g.:
```typescript
@Catch((volume: number, e: Error) => {
  // ...
})
sound(volume: number) {}
```

# Common#1.0.0
* New common decorators
  * **@Log(loggerFn?: Function)**
  * **@Debounce(wait: number = 500)**
  * **@Throttle(wait: number = 500)**
  * **@Decorate(decorateFunction: Function, ...args)**
  * **@SuppressConsole(methods?: string[])**
  * **@Bind()**
  * **@Catch(func: (e) => void)**
