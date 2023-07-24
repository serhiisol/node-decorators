import { Module } from '@server';

import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  namespace: 'users',
})
export class UsersModule { }
