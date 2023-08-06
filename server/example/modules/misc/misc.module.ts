import { Module } from '@server';

import { MiscController } from './misc.controller';

@Module({
  controllers: [MiscController],
})
export class MiscModule { }
