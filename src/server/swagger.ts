import { WebRoutes } from "./routes";
import { WebServer } from "./webserver";
import express, { Express } from 'express';
import { baseUrl, errorLog, infoLog } from "../common";
import * as TJS from "typescript-json-schema";
import * as path from 'path';
import * as fs from 'fs';
import { Global } from "../global";
import { APINamespace } from "../types";
import { APP_NAME, APP_SHORTENED, VERSION } from "../version";
import { APINamespaces } from "../data";


export namespace Swagger {
    let tags = {};
    let info = {
        title: `${APP_NAME} (${APP_SHORTENED})`,
        description: `${APP_NAME} API Collection`,
        license: {
            name: "Creative Commons Attribution Share Alike 4.0 International",
            url: "https://creativecommons.org/licenses/by/4.0"
        },
        contact: {
            // name: 'madkne',
            // email: 'twsdelavar@gmail.com',
        },
        version: VERSION,
    };
    let swaggerFileName = 'swagger.json';
    /********************** */
    async function generate() {
        let swaggerSchemes = ['http'];
        let swaggerUrl = new URL(baseUrl());
        if (swaggerUrl.protocol.startsWith('https')) {
            swaggerSchemes.unshift('https');
        }
        let swagger = {
            // openapi: "3.0",
            swagger: "2.0",
            info,
            // servers: [
            //     {
            //         url: `http://${Const.CONFIGS.server.host}:{port}/api/{basePath}`,
            //         description: "The production API server",
            //         basePath: {
            //             default: '/v1/'
            //         },
            //         port: {
            //             enum: [
            //                 String(Const.CONFIGS.server.port),
            //                 "80"
            //             ],
            //             default: String(Const.CONFIGS.server.port),
            //         },
            //     },
            // ],
            host: swaggerUrl.host,
            basePath: Global.APIBaseUrl,
            tags,
            paths: {},
            schemes: swaggerSchemes,
            consumes: [
                "application/json"
            ],
            produces: [
                "application/json"
            ],
            definitions: {},
            components: {},
            securityDefinitions: {
                // "Bearer": {
                //     "type": "apiKey",
                //     "name": "Authorization",
                //     "in": "header"
                // },
                "local_api_key": {
                    "type": "apiKey",
                    "name": Global.ENV.AUTH_HEADER_NAME,
                    "in": "header"
                }
            },

        }

        // =>get all apis
        let apis = await WebRoutes.getRoutes();
        let definitions: string[] = [];
        // console.log(apis)
        // =>add all paths
        for (const api of apis) {
            const swaggerAPIPath = '/' + api.version + '/' + api.path;
            // =>find same path
            let apiPath = swagger.paths[swaggerAPIPath];
            if (!apiPath) {
                swagger.paths[swaggerAPIPath] = {};
                apiPath = swagger.paths[swaggerAPIPath];
            }
            // =>add by api method
            apiPath[api.method.toLowerCase()] = {
                tags: [api.namespace],
                summary: api.des,
                description: api.description || api.des,
                consumes: api.consumes || [
                    "application/json",
                ],
                produces: [
                    "application/json"
                ],
                deprecated: api.deprecated,
                parameters: api.parameters || [],
                responses: api.responses || {},
                security: [],
            };
            // =>add security option, if need
            if (!api.noAuth) {
                apiPath[api.method.toLowerCase()].security = [{
                    local_api_key: [],
                }];
            }
            // =>add definitions
            if (api.usedDefinitions) {
                for (const def of api.usedDefinitions) {
                    if (definitions.indexOf(def) > -1) continue;
                    definitions.push(def);
                }
            }
            // console.log(apiPath)

        }
        // =>load all selected definitions
        try {
            let schemaDefinitions = await loadDefinitions(definitions);
            swagger.definitions = schemaDefinitions.definitions;
        } catch (e) {
            errorLog('swagger', 'failed to set definitions');
            errorLog('swagger', e);
        }

        // =>save swagger json file
        fs.writeFileSync(swaggerFileName, JSON.stringify(swagger, undefined, 2));


        return swagger;
    }
    /********************** */
    export async function init(app: Express) {
        try {
            // =>fill tags
            tags = APINamespaces;
            // =>init swagger
            const swaggerUi = require('swagger-ui-express');
            const swaggerDocument = await generate();

            app.use(Global.ENV.SWAGGER_BASE_URL, swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
                explorer: true,
                customCss: '.swagger-ui .topbar .topbar-wrapper .link { display: none }'
            }));
            app.get(Global.ENV.SWAGGER_BASE_URL, swaggerUi.setup(swaggerDocument));
            infoLog('swagger', `swagger docs now is in '${Global.ENV.SWAGGER_BASE_URL}'`);
        } catch (e) {
            errorLog('swagger', 'can not init swagger!');
            errorLog('swagger', e);
        }
    }
    /********************** */
    export async function loadDefinitions(definitions: string[]) {
        // console.log(path.join(path.dirname(__filename), '..', '..', 'src'))
        const program = TJS.getProgramFromFiles(
            [
                path.resolve('src', 'types.ts'),
                path.resolve('src', 'interfaces.ts'),
                path.resolve('src', 'internal-db', 'models', 'interfaces.ts'),
            ],
            {
                strictNullChecks: true,
                skipLibCheck: true
            },
        );

        // optionally pass argument to schema generator
        const settings: TJS.PartialArgs = {
            required: true,
            defaultProps: true,
        };

        // We can either get the schema for one file and one type...
        // const schema = TJS.generateSchema(program, "WorkflowState", settings);
        const generator = TJS.buildGenerator(program, settings);
        let selectedSchema = generator.getSchemaForSymbols(definitions);
        // console.log('schema:', selectedSchema)
        return selectedSchema;
    }
}