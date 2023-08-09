import { ClassConstructor } from '../types';
import { DEP_IDS_METADATA } from '../constants';

import { RootContainer } from '../root-container';

interface InjectableOptions {
  providedIn?: 'root';
}

export function Injectable(options?: InjectableOptions) {
  return (target: ClassConstructor) => {
    const params = Reflect.getMetadata('design:paramtypes', target) ?? [];
    const ids = Reflect.getMetadata(DEP_IDS_METADATA, target) ?? [];

    const verifiedIds = params.map((param: ClassConstructor, index: number) => {
      const depId = typeof param === 'function' ? param : null;

      return ids[index] ?? depId;
    });

    Reflect.defineMetadata(DEP_IDS_METADATA, verifiedIds, target);

    if (options?.providedIn === 'root') {
      RootContainer.provide([{
        provide: target,
        useClass: target,
      }]);
    }
  };
}
