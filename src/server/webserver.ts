import express, { Express } from 'express';
// import { WebRoutes } from './routes';
import * as path from 'path';
import * as fs from 'fs';
// import { Swagger } from './document/swagger';
import { debugLog, errorLog, importFile, infoLog } from '../common';
import { MiddlewareName } from '../types';
import * as https from 'https';
import { Global } from '../global';
import { APP_NAME } from '../version';
import { WebRoutes } from './routes';
import { Swagger } from './swagger';
// import * as cors from 'cors';

export namespace WebServer {
   export let app: Express;
   export async function initWebServer() {
      return new Promise(async (res) => {
         app = express();
         app.use(express.json({ limit: '400kb', strict: false }));
         // =>enable cors policy
         const corsOptions = {
            origin: '*',
            credentials: true,            //access-control-allow-credentials:true
            optionSuccessStatus: 200,
         }
         var cors = require('cors');
         app.use(cors(corsOptions));
         app.disable('x-powered-by');
         await loadMiddlewares();
         await WebRoutes.routes(app);

         // =>run https server
         if (Global.ENV.SSL) {
            try {
               const privateKey = fs.readFileSync(Global.ENV.SSL_PRIVATE_KEY_PATH);
               const certificate = fs.readFileSync(Global.ENV.SSL_CERTIFICATE_PATH);

               const credentials = { key: privateKey, cert: certificate };

               https.createServer(credentials, app)
                  .listen(443, () => {
                     infoLog('server', `(https) ${APP_NAME} listening on port 443`);
                  });
            } catch (e) {
               errorLog('ssl', `can not set ssl and init https server`);
               errorLog('ssl', e);
            }
         }
         // =>run http server
         app.listen(Global.ENV.HTTP_PORT, async () => {
            infoLog('server', `(http) ${APP_NAME} listening on port ${Global.ENV.HTTP_PORT}`);
            // =>init swagger, if allowed
            if (!Global.ENV.SWAGGER_DISABLED) {
               await Swagger.init(app);
            }

            res(true);
         });


      });

   }



   async function loadMiddlewares() {
      for (const middle of Global.INIT_MIDDLEWARES) {
         let middleInit = await loadMiddleware(middle);
         // =>use as middleware
         app.use(async (req, res, next) => {
            // =>handle middleware
            const stat = await middleInit.handle(req, res);
            if (stat) {
               next();
            }
         });
         debugLog('middleware', 'init middleware: ' + middle);
      }

      // const formidable = require('express-formidable');
      // app.use(formidable());
      // =>get upload info
      // const upload = multer({ dest: Const.CONFIGS.server.uploads_path + "/" }).any();
      // app.use(upload)
   }

   export async function loadMiddleware(middle: MiddlewareName) {
      let middleFile = await importFile(path.join(path.dirname(__filename), 'middlewares', middle));
      if (!middleFile) {
         errorLog('middleware', `can not load '${middle}' middleware`);
         return undefined;
      }
      let middleInit = new (middleFile['middleware']())();


      return middleInit;
   }


}