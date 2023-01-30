/**
 * Injection token class
 */
export class InjectionToken {
  constructor(public name: string) {}

  toString(): string {
    return this.name;
  }
}
