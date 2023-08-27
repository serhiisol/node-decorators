import { Decorate } from '@server';

export function Method(key: string) {
  return Decorate('decorated', key);
}
