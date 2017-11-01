/**
 * Injection token class
 *
 * @export
 */
export class InjectionToken {
  constructor(public name: string) {}

  public toString(): string {
    return this.name;
  }
}
