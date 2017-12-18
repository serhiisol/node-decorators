import "reflect-metadata";
import {Container} from "../container";
import {NoReturnTypeError} from "../errors/no-return-type";

/**
 * Create Injectable object based on type returned by method
 * It helps to create more complicated objects and register it on DI
 * Supports registering via return type
 * Inspired by Bean annotation in Spring
 *
 * @export
 * @param {Object} target
 * @param {string} key
 * @param {PropertyDescriptor} descriptor
 */
export function Bean(target: Object | Function, key: string, descriptor: PropertyDescriptor) {
  const returnType = Reflect.getMetadata("design:returntype", target, key);
  if (!returnType) throw new NoReturnTypeError(key);
  Container.provide([{provide: returnType.name, useValue: descriptor.value.apply(this)}]);
  return descriptor;
}
