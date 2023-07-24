import { ApiError, Inject, Module } from '@server';

import { TOKEN } from './injectable';

@Module({
  namespace: 'posts',
  providers: [
    { provide: TOKEN, useValue: 'posts' },
  ],
})
export class PostsModule {
  constructor(
    @Inject(TOKEN) token: string,
  ) {
    if (token !== 'posts') {
      throw new ApiError('scope-error');
    }
  }
}
