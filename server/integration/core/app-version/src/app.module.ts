import { APP_VERSION, Module } from '@server';

import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  providers: [
    { provide: APP_VERSION, useValue: 'app-version' },
  ],
})
export class AppModule { }
