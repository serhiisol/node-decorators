import * as express from 'express';
import {
  bootstrapControllersFromDirectory
} from '../../index';


let app: any = express();

bootstrapControllersFromDirectory(app, `${__dirname}/controllers`);

app.listen(3003);
