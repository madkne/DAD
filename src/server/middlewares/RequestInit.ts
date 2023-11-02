import { Request, Response } from "express";
import { Middleware } from "./middleware";
import * as fs from 'fs';
import * as path from 'path';
import { CoreRequest } from "../request";
import { debugLog } from "../../common";
import { Global } from "../../global";


export function middleware() {
   return RequestInit;
}


export class RequestInit extends Middleware {
   path: string;
   appName: string;

   /**************************************** */
   async handle(req: Request, res: Response) {
      this.path = req.path;
      let request = new CoreRequest(req, res);
      // =>init core request
      req.body[Global.CoreRequestKey] = request;
      req.body[Global.CoreRequestKey].startResponseTime = new Date().getTime();
      debugLog('request', `[${request.method}] request from ${request.clientIp()} to '${this.path}'`);

      return true;
   }
}