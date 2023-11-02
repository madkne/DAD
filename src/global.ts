import { ServerDatabase } from "./internal-db/database";
import { EnvironmentVariables } from "./interfaces";




export namespace Global {

    export let ENV: EnvironmentVariables;

    /**
     * internal database
     */
    export let IDB: ServerDatabase;

    export const IDB_MODELS = ['User'];
}