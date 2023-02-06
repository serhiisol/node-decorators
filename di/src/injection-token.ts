export class InjectionToken {
  constructor(public name: string) {}

  toString(): string {
    return `InjectionToken ${this.name}`;
  }
}
