![Node Decorators](https://github.com/serhiisol/node-decorators/blob/master/decorators.png?raw=true)

Project implements decorators for modern tools for NodeJS like:
- [Socket.IO]

### Installation
```
npm install @decorators/socket --save
```
### API
#### Decorators
##### Method
* @Async
```
...
import { Async } from 'node-decorators/co';
...
let testAsyncFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('testAsyncFunc');
      resolve()
    }, 3000);
  });
};
...
class TestController {
  @Async
  *getData() {
    console.log('code before async function');
    yield testAsyncFunc();
    console.log('code after async function');
  }
}

...
```




[Socket.IO]:http://socket.io/
