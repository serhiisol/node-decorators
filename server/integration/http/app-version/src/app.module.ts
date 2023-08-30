import { Module } from '@server';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class AppModule { }
