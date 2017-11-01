export class DiError extends Error {

  name: string;
  message: string;

  constructor(message: string) {

    super(message);

    Object.defineProperty(this, 'name', {
      value: this.constructor.name
    });

    (Error as any).captureStackTrace(this, this.constructor);
  }

}
