import { Injectable } from '@decorators/di';

@Injectable()
export class PostsService {
  list() {
    return [{ name: 'hello world' }];
  }
}
