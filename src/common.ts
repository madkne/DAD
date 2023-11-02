import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Request } from "express";
import { Global } from "./global";
import { EnvironmentVariables, EnvironmentVariablesKeys } from "./interfaces";
/***************************************** */
export function loadEnvFile() {
    try {
        require('dotenv').config();
        let envVariables: EnvironmentVariables = JSON.parse(JSON.stringify(process.env));
        // =>remove unused properties
        for (const key in envVariables) {
            if (!EnvironmentVariablesKeys.includes(key)) {
                delete envVariables[key];
            }
        }
        // =>set defaults for env
        if (!envVariables.ROOT_USERNAME) envVariables.ROOT_USERNAME = 'root';
        if (!envVariables.ROOT_PASSWORD) envVariables.ROOT_PASSWORD = 'root';
        if (!envVariables.STORAGE_PATH) {
            envVariables.STORAGE_PATH = path.join(__dirname, 'storage');
            if (!fs.existsSync(envVariables.STORAGE_PATH)) {
                fs.mkdirSync(envVariables.STORAGE_PATH, { recursive: true });
            }
        }
        if (!envVariables.HTTP_PORT)
            envVariables.HTTP_PORT = 8082;

        if (!envVariables.DB_CONNECTION) {
            envVariables.DB_CONNECTION = 'sqlite';
            if (!envVariables.DB_PATH) envVariables.DB_PATH = path.join(envVariables.STORAGE_PATH, 'db.sqlite');
        }
        if (!envVariables.DS_TYPES || envVariables.DS_TYPES.length == 0) {
            envVariables.DS_TYPES = 'sqlite' as any;
        }
        if (envVariables.DEBUG_MODE === undefined) envVariables.DEBUG_MODE = false;
        if (!envVariables.SWAGGER_BASE_URL) envVariables.SWAGGER_BASE_URL = '/api-docs';
        if (!envVariables.HOSTNAME) envVariables.HOSTNAME = 'localhost';
        if (!envVariables.AUTH_HEADER_NAME) envVariables.AUTH_HEADER_NAME = 'Authorization';

        // =>normalize 
        envVariables.DS_TYPES = (envVariables.DS_TYPES as any).split(',').map(i => i.trim()).filter(i => i.length > 0) as any;
        if (typeof envVariables.DEBUG_MODE === 'string') {
            envVariables.DEBUG_MODE = Number(envVariables.DEBUG_MODE) as any;
        }
        if (typeof envVariables.HTTP_PORT === 'string') {
            envVariables.HTTP_PORT = Number(envVariables.HTTP_PORT);
        }



        Global.ENV = envVariables;
        // =>create logs folder
        if (!fs.existsSync(logsPath())) {
            fs.mkdirSync(logsPath());
        }
        // debugLog(JSON.stringify(Global.ENV, null, 2));
        return envVariables;
    } catch (e) {
        errorLog('err4574332', e, 0, true)
        return {};
    }


}



/***************************************** */
function log(text: string, label?: string, type: 'info' | 'error' | 'normal' | 'debug' = 'normal') {
    let dateTime = new Date();
    let time = dateTime.toTimeString().slice(0, 8);
    let date = dateTime.toISOString().slice(0, 10).replace(/-/g, '.');
    let message = `[${date}-${time}:${dateTime.getMilliseconds()}] : ${text}`;
    if (label) {
        message = `[${date}-${time}:${dateTime.getMilliseconds()}] ${label} : ${text}`;
    }
    if (type === 'error') {
        console.warn("\x1b[31m\x1b[1m" + message);
    } else if (type === 'info') {
        console.log("\x1b[34m\x1b[1m" + message);
    } else if (type === 'debug') {
        console.log("\x1b[33m\x1b[1m" + message);
    } else {
        console.log(message);
    }
}
/***************************************** */
export function logsPath() {
    return path.join(Global?.ENV?.STORAGE_PATH ?? '.', 'logs');
}
/***************************************** */
export function infoLog(name: string, message: string) {
    // if (Const.SERVER_MODE !== 'test') {
    //     log(message, name, 'info');
    // }
    try {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        writeLogOnFile('info', `${name} ${message}`);

    } catch (e) {
        log(`can not write on ${path.join(logsPath(), 'info')} file`, 'err455563', 'error');
    }
}
/***************************************** */
export function debugLog(name: string, message: string) {
    // console.log(settings('DEBUG_MODE'))
    if (!Global.ENV || !Global.ENV.DEBUG_MODE) return;
    // if (Const.SERVER_MODE !== 'test') {
    //     log(message, name, 'debug');
    // }
    try {
        if (typeof message === 'object') {
            message = JSON.stringify(message);
        }
        writeLogOnFile('debug', `${name} ${message}`);
    } catch (e) {
        log(`can not write on ${path.join(logsPath(), 'debug')} file`, 'err455563', 'error');
    }
}
/***************************************** */
export function errorLog(name: string, error: any, uid?: number, noDBLog = false) {
    if (Global.ENV?.DEBUG_MODE && typeof error !== 'string') {
        console.warn(error);
    }
    log(error, name, 'error');
    let jsonError = {};
    if (typeof error == 'object') {
        try {
            jsonError = JSON.stringify(error);
        } catch (e) { jsonError = String(error); }
    }
    // =>add error on db
    if (!noDBLog) {
        try {
            // dbLog({ namespace: 'other', name, mode: LogMode.ERROR, user_id: uid, meta: { error, jsonError } });
        } catch (e) { }
    }

    writeLogOnFile('errors', `${name} ${uid ? uid : ''}::${error}`);
}
/***************************************** */
function writeLogOnFile(type = 'info', text: string) {
    try {
        let time = new Date().toTimeString().slice(0, 8);
        let date = new Date().toISOString().slice(0, 10).replace(/-/g, '.');
        fs.writeFileSync(path.join(logsPath(), type + '.log'), `[${date}-${time}] ${text}\n`, {
            flag: 'a',
        });
    } catch (e) {
        log(`can not write on ${path.join(logsPath(), 'errors')} file`, 'err4553', 'error');
    }
}
/***************************************** */
export function generateString(length = 10, includeNumbers = true, includeChars = true) {
    var result = '';
    var characters = '';
    if (includeChars) {
        characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }
    if (includeNumbers) {
        characters += '0123456789';
    }
    if (!includeChars && !includeNumbers) {
        characters += '-';
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/***************************************** */
export async function sleep(timeout = 1000) {
    return new Promise((res) => {
        setTimeout(() => {
            res(true);
        }, timeout);
    });
}
/***************************************** */
// export async function dbLog(options: { namespace: WorkflowNamespace, name: string, mode?: LogMode, meta?: object; user_id?: number; ip?: string; }) {
//     try {
//         if (!options.mode) options.mode = LogMode.INFO;
//         if (!Const.DB?.models?.logs) return;
//         await Const.DB.models.logs.create({
//             name: options.name,
//             namespace: options.namespace,
//             user_id: options.user_id,
//             ip: options.ip,
//             mode: options.mode,
//             meta: options.meta,
//             created_at: new Date().getTime(),
//         });
//     } catch (e) {
//         console.trace();
//         // errorLog('err66553', e);
//         console.log('err66553', options.name, e);
//         console.log(options);
//     }
// }
/***************************************** */
export function absUrl(path: string) {
    if (path.startsWith('/')) path = path.substring(1);
    return `http://${Global.ENV?.HOSTNAME}:${Global.ENV?.HTTP_PORT}/${path}`;

}
/***************************************** */
export function makeAbsoluteUrl(url: string, baseUrl?: string) {
    if (!baseUrl) return url;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ftp://')) return url;

    if (baseUrl.endsWith('/')) baseUrl = baseUrl.substring(0, baseUrl.length - 1);
    if (url.startsWith('/')) url = url.substring(1);

    return baseUrl + '/' + url;
}
/***************************************** */

export function clone<T = any>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}
/***************************************** */
/**
 * 
 * @param filePath without '.js' extension
 */
export async function importFile(filePath: string) {
    // =>if 'test' mode
    // if (Const.SERVER_MODE === 'test') {
    //     filePath += '.ts';
    // } else {
    filePath += '.js';
    // }
    if (!fs.existsSync(filePath)) {
        errorLog('import', `not found file in '${filePath}' path`);
        return undefined;
    }
    return await import(filePath);
}
/***************************************** */
