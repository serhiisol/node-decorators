import { Async } from '../';

let testAsyncFunc = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log('testAsyncFunc');
      resolve()
    }, 3000);
  });
};

class TestController {

  @Async
  *getData() {
    console.log('code before async function');
    yield testAsyncFunc();
    console.log('code after async function');
  }

}

let testController= new TestController();

testController.getData();
