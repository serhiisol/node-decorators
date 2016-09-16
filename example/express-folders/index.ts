import * as express from 'express';
import {
  bootstrapControllersFromDirectory
} from '../../express';


let app: any = express();

bootstrapControllersFromDirectory(app, `${__dirname}/controllers`);

app.listen(3003);
