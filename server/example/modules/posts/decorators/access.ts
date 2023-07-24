import { Decorate } from '@server';

export function Access(access: string) {
  return Decorate('access', access);
}
