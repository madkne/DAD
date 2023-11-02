import { Express, static as expressStatic } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { ApiRoute } from '../interfaces';
import { absUrl, debugLog, errorLog, importFile } from '../common';
import { CoreRequest } from './request';
import { HttpStatusCode } from '../types';
import { Global } from '../global';
import { APP_NAME, APP_TEXT_ART, VERSION } from '../version';


export namespace WebRoutes {
    export let assetsBaseUrl = '/assets';

    export async function routes(app: Express) {
        // =>get all apis
        let apis = await getRoutes();
        // console.log(apis)
        // =>add admin apis
        for (const api of apis) {
            app[api.method.toLowerCase()](api.absPath, async (req, res) => {
                // =>init core request class
                let coreRequest = req.body[Global.CoreRequestKey] as CoreRequest;
                // =>find target class file
                let classFilePath = path.join(path.dirname(__filename), '..', 'api', api.namespace, api.method.toLowerCase());
                // =>init api class
                let classFile = await importFile(classFilePath);
                // =>not found
                if (!classFile) {
                    errorLog('route', `not found request class file: '${classFilePath}'`);
                    coreRequest.response('', HttpStatusCode.HTTP_404_NOT_FOUND);
                    return;
                }
                let apiClassInstance = new (classFile.classApi())(coreRequest);
                // console.log('req:', api.functionName, apiClassInstance['request'], classFilePath);
                // =>call api function
                let resP = await apiClassInstance[api.functionName]();
                let response: string, status: HttpStatusCode, contentType: string;
                if (Array.isArray(resP)) {
                    [response, status] = resP;
                    if (resP.length > 2) {
                        contentType = resP[2];
                    }
                }
                // =>response 
                coreRequest.response(response, status, contentType);
            });
        }

        // app.use(assetsBaseUrl, expressStatic(path.join(__dirname, '..', 'public', 'assets')));
        app.get('/', (req, res) => {
            let html = `<html>
            <body>
            <h1>${APP_NAME} - version ${VERSION}</h1>
            <hr>`;
            // =>if swagger enabled
            if (!Global.ENV.SWAGGER_DISABLED) {
                html += `
                <p><strong>[+] swagger docs: </strong><a href="${Global.ENV.SWAGGER_BASE_URL}">${Global.ENV.SWAGGER_BASE_URL}</a></p>`
            }
            html += `
            </body>
            </html>`;
            res.write(html);
            res.end();
        });


    }

    export async function getRoutes(): Promise<ApiRoute[]> {
        let apis: ApiRoute[] = [];
        for (const namespace of Global.APINamespaces) {
            // =>import namespace routes
            let routesFilePath = path.join(path.dirname(__filename), '..', 'routes', namespace.name);

            let routesFile = await importFile(routesFilePath);
            const routesList = routesFile['apis'] as ApiRoute[];


            for (const api of routesList) {
                if (!api.path.startsWith(namespace.name + '/') && !api.path.startsWith(`/${namespace.name}/`)) {
                    api.path = namespace.name + '/' + api.path;
                }
                if (!api.version) {
                    api.version = 'v1';
                }
                api.namespace = namespace.name;
                if (api.path[0] === '/') api.path = api.path.substring(1);
                api.absPath = `${Global.APIBaseUrl}${api.version}/${api.path}`;
                apis.push(api);
            }
        }

        return apis;
    }
}