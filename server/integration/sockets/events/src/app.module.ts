import { Module } from '@server';

import { AppController } from './app.controller';
import { Sequence } from './sequence';

@Module({
  controllers: [AppController],
  providers: [Sequence],
})
export class AppModule { }
