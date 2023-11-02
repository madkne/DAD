import { Options, Sequelize } from "sequelize";
import * as path from 'path';
import * as fs from 'fs';
import { debugLog, errorLog, infoLog } from "../common";
import { Global } from "../global";

export class ServerDatabase {
    dbConn: Sequelize;
    alterModels = false;
    constructor() {

    }
    /************************************************************ */
    alterAllModels() {
        this.alterModels = true;
        infoLog('db', 'set Alter all database models');
    }
    /************************************************************ */
    async connect() {
        let options: Options = {
            database: Global.ENV.DB_NAME,
            storage: Global.ENV.DB_PATH,
            dialect: Global.ENV.DB_CONNECTION,
            username: Global.ENV.DB_USERNAME,
            password: Global.ENV.DB_PASSWORD,
            host: Global.ENV.DB_HOST,
            port: Global.ENV.DB_PORT,
            dialectOptions: {
                timezone: 'Z',
                connectTimeout: 1000,
            },
            logging: false,
            // logging: console.log,
            // logging: dbConf.logging,
        };
        this.dbConn = new Sequelize(options);
        // =>authenticate in database
        try {
            await this.dbConn.authenticate();
            return true;
        } catch (error) {
            errorLog('err45', error);
        }
        return false;
    }
    /************************************************************ */
    async syncModel<M extends string = string>(name: M, argvs = [], force = false, alter = false, fullPath?: string) {
        try {
            if (this.alterModels !== undefined) {
                alter = this.alterModels;
            }
            if (!fullPath) {
                fullPath = path.join(__dirname, 'models', name + '.js');
            }
            // =>try to import file and define model
            const module = await import(fullPath);
            const res = module['load'](...argvs);
            if (res === false) return false;
            // =>sync model
            // console.log('model for:', name, argvs, res);
            if (res) {
                await res['sync']({
                    force, alter,
                });
            } else {
                await this.dbConn.sync();
            }
            debugLog('db', `sync model '${name}' ${res ? 'successfully' : 'failed!'} with alter ${alter}`)
            return true;
        } catch (e) {
            errorLog('err5544', name + ' - ' + argvs + ' - ' + fullPath + ' - ' + e);
            console.warn(e);
            return false;
        }
    }
    /************************************************************ */
    async syncInitModels(force = false, alter = false) {

        for (const model of Global.IDB_MODELS) {
            // =>detect model path
            let fullPath = path.join(__dirname, 'models', model + '.js');
            const res = await this.syncModel(model, [], force, alter, fullPath);
            // debugLog('model', `init model '${model}' ${res ? 'successfully' : 'failed!'} with alter ${alter}`);
        }
    }

}