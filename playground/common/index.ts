import { Catch } from '@decorators/common';

class Animal {

  constructor(
    public name: string
  ) {}

  @Catch((volume: number, err: Error) => {
    console.log(volume);
    console.log(err);
  })
  sound(volume: number) {
    throw new Error(volume.toString());
  }

}

let rabbit: Animal = new Animal('Rabbit');
rabbit.sound(10);
