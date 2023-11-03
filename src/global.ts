import { ServerDatabase } from "./internal-db/database";
import { DefinedAPINamespace, EnvironmentVariables } from "./interfaces";
import { APINamespace, DatabaseType, MiddlewareName } from "./types";




export namespace Global {

    export let ENV: EnvironmentVariables;

    /**
     * internal database
     */
    export let IDB: ServerDatabase;

    export const IDB_MODELS = ['User', 'Config', 'Session', 'Project', 'DataSource'];

    export const INIT_MIDDLEWARES: MiddlewareName[] = ['RequestInit', 'Authentication', 'RoutingResolver'];

    export const AuthenticateUserKey = '_.dad._auth_user_';

    export const CoreRequestKey = '_.dad.core_request';

    export const APINamespaces: DefinedAPINamespace[] = [
        {
            name: 'server',
            description: 'server relative API endpoints'
        },
        {
            name: 'project',
            description: 'project relative API endpoints'
        },
        {
            name: 'user',
            description: 'user relative API endpoints'
        },
    ];//TODO:

    export const APIBaseUrl = '/api/';
    export const DATABASE_DRIVER_PACKAGES: { [k in DatabaseType]?: string } = {
        'sqlite': "sqlite3@5.1.6",
        'mysql': "mysql2@2.3.0",
    }; //TODO:
}