import { Injectable } from '@server';

@Injectable()
export class PostsService {
  list() {
    return [{ name: 'hello world' }];
  }
}
