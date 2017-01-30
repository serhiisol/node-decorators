import { Log, Bind } from '@decorators/common';

@Log()
class Animal {

  constructor(
    public name: string
  ) {}

  @Bind()
  sound(volume: number) {
    console.log(this.name, ': Auuuu', volume);
  }

}

let rabbit: Animal = new Animal('Rabbit');

function exec(fn, arg) {
  //some heavy logic
  return fn(arg);
}



rabbit.sound = function () {
  console.log(this.name);
};

exec(rabbit.sound, 500);
