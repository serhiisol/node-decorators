import { Application, HttpModule } from '@server';
import { json } from 'body-parser';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await Application.create(AppModule);
  const module = await app.inject<HttpModule>(HttpModule);

  module.set('view engine', 'ejs');
  module.set('views', join(__dirname, '/views'));
  module.use(json());

  await module.listen(3000);
  console.info('Server is running on port 3000');
}

bootstrap().catch(console.error);
