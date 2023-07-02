import { Module } from '../../../src';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  namespace: 'users',
})
export class UsersModule { }
