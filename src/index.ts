import { debugLog, infoLog, loadEnvFile } from "./common";
import { Global } from "./global";
import { ServerDatabase } from "./internal-db/database";
import { APP_NAME, APP_SHORTENED, APP_TEXT_ART, VERSION } from "./version";


console.log(APP_TEXT_ART);
console.log(`${APP_NAME} (${APP_SHORTENED}) - VERSION ${VERSION}\n\n`);
main();

async function main() {
    loadEnvFile();
    // =>try to connect to database
    // console.log(Global.ENV)
    // debugLog('main', Global.ENV);
    // =>create database instance
    Global.IDB = new ServerDatabase();
    Global.IDB.connect().then(async res => {
        if (res) {
            infoLog('db', `Connected to '${Global.IDB.dbConn.getDatabaseName()}' Database successfully`);
            // =>sync init models
            await Global.IDB.syncInitModels(false, Global.IDB.alterModels);

            // =>init webserver
            // await WebServer.initWebServer();
        }
    });
}