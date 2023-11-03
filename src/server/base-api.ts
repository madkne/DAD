import { APIResponse, APIResponsePagination } from "../interfaces";
import { DBConfigKey, HttpResponse, HttpStatusCode } from "../types";
import { CoreRequest } from "./request";
import { clone, errorLog } from "../common";
import { Config } from "../internal-db/models/Config";
import { ConfigValueType } from "../internal-db/models/interfaces";
export class BaseAPI {
    request: CoreRequest;
    /*************************************** */
    constructor(request: CoreRequest) {
        this.request = request;
    }
    /*************************************** */
    param<T = string>(key: string, def?: T, isArray = false) {
        let value: T;
        if (this.request.method === 'GET' || this.request.method === 'DELETE') {
            value = this.request.req.query[key] as any;
            if (isArray) {
                try {
                    value = JSON.parse(value as any);
                } catch (e) { }
            }
        } else {
            value = this.request.req.body[key];
        }
        if ((value === undefined || value === null) && def) {
            value = def;
        }
        return value;
    }
    /*************************************** */
    paramNumber<T extends number = number>(key: string, def?: T): T {
        let value = Number(this.param<T>(key, def));
        if (isNaN(value)) return def;
        return value as T;
    }
    /*************************************** */
    paramBoolean(key: string, def?: boolean) {
        let value = this.param(key, def);
        if (value as any === 'true' || value === true) return true;
        if (value as any === 'false' || value === false) return false;
        return Boolean(value);
    }
    /*************************************** */
    error404(data?: string | object) {
        return this.error(HttpStatusCode.HTTP_404_NOT_FOUND, data);
    }
    /*************************************** */
    error400(data?: string | object) {
        return this.error(HttpStatusCode.HTTP_400_BAD_REQUEST, data);
    }
    /*************************************** */
    error403(data?: string | object) {
        return this.error(HttpStatusCode.HTTP_403_FORBIDDEN, data);
    }
    /*************************************** */
    async updateConfig(key: DBConfigKey, value: any) {
        let dataType: ConfigValueType = 'string';
        // =>detect data type
        if (typeof value === 'number' || typeof value === 'boolean') dataType = 'number';
        else if (typeof value === 'object' || Array.isArray(value)) dataType = 'json';
        // =>cast value to string
        let valueString = String(value);
        if (typeof value === 'boolean') {
            valueString = String(Number(value));
        }
        else if (dataType === 'json') {
            valueString = JSON.stringify(value);
        }
        // =>find config, if exist
        const beforeConfig = await Config.findOne({ where: { key } });
        let updatedConfig;
        // =>just update
        if (beforeConfig) {
            updatedConfig = beforeConfig;
            await Config.update({
                value: valueString,
                data_type: dataType,
            }, { where: { key } });
        }
        // =>insert new config
        else {
            updatedConfig = await Config.create({
                key,
                value: valueString,
                data_type: dataType,
            });
        }

        return updatedConfig;
    }
    /*************************************** */
    async readConfig<T = string>(key: DBConfigKey, defaultValue?: T): Promise<T> {
        // =>find config, if exist
        const configDB = await Config.findOne({ where: { key } });
        if (!configDB) return defaultValue;
        const config = configDB.toJSON();
        // =>cast value by data type
        if (config.data_type === 'string') return config.value;
        if (config.data_type === 'number') return Number(config.value) as T;
        if (config.data_type === 'json') return JSON.parse(config.value) as T;
        return defaultValue;
    }
    /*************************************** */
    // async errorLog(namespace: WorkflowNamespace, name: string, meta?: object) {
    //     await this.log(namespace, name, LogMode.ERROR, meta);
    //     // errorLog('log', '[ERROR] ' + namespace + ':' + name + ' | ' + var1 + ', ' + var2);
    // }
    /*************************************** */
    // async infoLog(namespace: WorkflowNamespace, name: string, meta?: object) {
    //     await this.log(namespace, name, LogMode.INFO, meta);
    //     // debugLog('log', '[INFO] ' + namespace + ':' + name + ' | ' + var1 + ', ' + var2);
    // }
    /*************************************** */
    // async log(namespace: WorkflowNamespace, name: string, mode: LogMode, meta?: object) {
    //     try {
    //         await Const.DB.models.logs.create({
    //             name,
    //             namespace,
    //             user_id: this.request.user() ? this.request.user().id : undefined,
    //             ip: this.request.clientIp(),
    //             mode,
    //             meta,
    //             created_at: new Date().getTime(),
    //         });
    //     } catch (e) {
    //         console.trace();
    //         // errorLog('err6655', e);
    //     }
    // }//TODO:
    /*************************************** */
    response<T = any>(result?: T, code: HttpStatusCode = HttpStatusCode.HTTP_200_OK, message?: string, applyObjects?: object): HttpResponse {
        // =>if result is not set
        if (result == undefined) {
            result = '' as any;
        }
        let resp: APIResponse = {
            data: result,
            success: false,
            statusCode: code,
            responseTime: (new Date().getTime()) - this.request.startResponseTime,
        }
        if (applyObjects) {
            resp = { ...resp, ...applyObjects };
        }
        // =>check for success response
        if (code >= 200 && code < 300) {
            resp.success = true;
        }
        // =>check for message
        if (message) {
            resp.message = message;
        }

        return [JSON.stringify(resp), code, 'application/json'];
    }
    /*************************************** */
    // async paginateResponse<T = any>(model: Model<T>, options?: {
    //     filters?: FilterQuery<T>,
    //     mapCallback?: (row: T) => Promise<T> | T,
    //     // filterCallback?: (row: T) => Promise<T> | T
    // }): Promise<HttpResponse> {
    //     if (!options) {
    //         options = {};
    //     }
    //     if (!options.filters) options.filters = {};
    //     // =>get params
    //     let pageSize = this.paramNumber('page_size', 10);
    //     let page = this.paramNumber('page', 1);
    //     // =>call query
    //     let results = await model.find(options.filters)
    //         .skip((page * pageSize) - pageSize)
    //         .limit(pageSize);
    //     // =>count documents find
    //     const count = await model.countDocuments(options.filters);
    //     // =>map results, if exist
    //     if (options.mapCallback) {
    //         for (let res of results) {
    //             res = await options.mapCallback(res) as any;
    //         }
    //     }
    //     let pagination: APIResponsePagination = {
    //         page_size: pageSize,
    //         page,
    //         page_count: Math.ceil(count / pageSize),
    //     };

    //     return this.response(results, HttpStatusCode.HTTP_200_OK, undefined, { pagination });
    // }//TODO:
    /*************************************** */
    paginateResponseOld<T = any>(result: T[]): HttpResponse {
        // =>get params
        let pageSize = this.paramNumber('page_size', 10);
        let page = this.paramNumber('page', 1);
        let pagination: APIResponsePagination = {
            page_size: pageSize,
            page,
            page_count: Math.ceil(result.length / pageSize),
        };
        // =>calc offset
        let startOffset = (page * pageSize) - pageSize;
        let endOffset = startOffset + pageSize;
        // =>not enough results
        if (result.length <= startOffset) {
            return this.response([], HttpStatusCode.HTTP_200_OK, undefined, { pagination });
        }
        if (result.length <= endOffset) endOffset = result.length;
        // =>get page of results
        let paginateResults = result.slice(startOffset, endOffset);
        // console.log(result, startOffset, endOffset)
        return this.response(paginateResults, HttpStatusCode.HTTP_200_OK, undefined, { pagination });
    }

    /*************************************** */
    error(code: HttpStatusCode = HttpStatusCode.HTTP_400_BAD_REQUEST, data?: string | object) {
        return this.response(data, code);
    }
    /*************************************** */
    formDataParam<T = string>(key: string, def: T = undefined, isFile = false): T {
        let value: T;
        if (isFile) {
            value = this.request.req['files'][key];
        } else {
            value = this.request.req['fields'][key];
        }
        if (!value) value = def;
        return value;
    }
    /*************************************** */
    allFormDataParams(type: 'files' | 'both' | 'non_files' = 'non_files') {
        let params = {};
        if (type === 'non_files' || type === 'both') {
            if (typeof (this.request.req['fields']) === 'object') {
                for (const key of Object.keys(this.request.req['fields'])) {
                    params[key] = this.request.req['fields'][key];
                }
            }
        }
        if (type === 'files' || type === 'both') {
            if (typeof (this.request.req['files']) === 'object') {
                for (const key of Object.keys(this.request.req['files'])) {
                    params[key] = this.request.req['files'][key];
                }
            }
        }

        return params;
    }
    /*************************************** */
    /*************************************** */
    /*************************************** */
    /*************************************** */
    /*************************************** */
    /*************************************** */

    isAdmin() {
        if (!this.request.user()) return false;
        return this.request.user().admin_level > 0;
    }
}