import { GLOBAL_PIPE, Module } from '@server';

import { AppController } from './app.controller';
import { ServerPipe } from './pipes';
import { Sequence } from './sequence';

@Module({
  controllers: [AppController],
  providers: [
    Sequence,
    { provide: GLOBAL_PIPE, useClass: ServerPipe, multi: true },
  ],
})
export class AppModule { }
