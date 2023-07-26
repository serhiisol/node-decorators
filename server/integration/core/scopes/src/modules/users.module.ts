import { ApiError, Inject, Module } from '@server';

import { TOKEN } from './injectable';

@Module({
  namespace: 'posts',
  providers: [
    { provide: TOKEN, useValue: 'users' },
  ],
})
export class UsersModule {
  constructor(
    @Inject(TOKEN) token: string,
  ) {
    if (token !== 'users') {
      throw new ApiError('scope-error');
    }
  }
}
