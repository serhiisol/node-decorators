import {DiError} from './error';

export class NoReturnTypeError extends DiError {

  constructor(name: string) {
    super(`In order to use Bean annotation on method ${name} you need to define return type`)

  }

}
