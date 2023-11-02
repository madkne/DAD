import { HttpStatusCode } from '../../types';
import { Request, Response } from "express";
import { Middleware } from './middleware';
import { errorLog } from '../../common';
import { WebRoutes } from '../routes';
import * as url from 'url';
import { Global } from '../../global';
import { UserModel } from '../../internal-db/models/interfaces';

export function middleware() {
   return Authentication;
}

export class Authentication extends Middleware {
   req: Request;

   async handle(req: Request, res: Response) {
      this.req = req;
      // =>check if root url
      if (req.path == '/') return true;
      // =>check for exclude urls
      let excludeUrls = [Global.ENV.SWAGGER_BASE_URL, WebRoutes.assetsBaseUrl];
      for (const url of excludeUrls) {
         if (req.path.startsWith(url)) {
            return true;
         }
      }
      // =>check for exclude apis
      let apis = await WebRoutes.getRoutes();
      for (const api of apis) {
         // console.log(req.path, api.absPath)
         if (req.path === api.absPath && api.noAuth) {
            return true;
         }
      }
      // console.log('Authentication....', req.headers[Const.CONFIGS.auth_user.header_name], Const.CONFIGS.auth_user.header_name, req.headers);
      const headerName = Global.ENV.AUTH_HEADER_NAME.toLowerCase();
      // =>check authentication header

      if (req.headers[headerName]) {
         const authToken = req.headers[headerName] as string;
         // console.log('token:', authToken)
         // =>find user session by token
         const userFind = await this.getUserBySessionToken(authToken);
         // console.log('userfind:', userFind)
         if (userFind === 'invalid') {
            return this.responseError(req, HttpStatusCode.HTTP_401_UNAUTHORIZED, 'token not valid');
         }
         else if (userFind === 'expired') {
            return this.responseError(req, HttpStatusCode.HTTP_401_UNAUTHORIZED, 'token expired');
         }
         else {
            req.body[Global.AuthenticateUserKey] = userFind;

         }
      }
      // =>if no have auth
      if (!req.body[Global.AuthenticateUserKey]) {
         errorLog('no_auth_api', JSON.stringify([req.path, req.method]), 0, true);
         // =>return 401 response
         return this.responseError(req, HttpStatusCode.HTTP_401_UNAUTHORIZED, `auth need, set '${headerName}' header on request`);
      }

      return true;
   }
   /***************************************** */
   async getUserBySessionToken(authToken: string): Promise<UserModel | 'expired' | 'invalid'> {
      let startTime = new Date().getTime();
      // =>check if directly method
      let res = 'invalid';//await Auth.getUserByDirectlyToken(authToken);
      // console.log(res)//TODO:
      if (res !== 'invalid') {
         return res as any;
      }

      return 'invalid';
   }
}
