![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [CoJS]

### Installation
```
npm install @decorators/co --save
```
### API
#### Decorators
##### Method
* @Async()
```typescript
import { Async } from '@decorators/co';

let testAsyncFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('testAsyncFunc');
      resolve()
    }, 3000);
  });
};

class TestController {
  @Async()
  *getData() {
    console.log('code before async function');
    yield testAsyncFunc();
    console.log('code after async function');
  }
}
```

### License
MIT

[CoJS]:https://github.com/tj/co
