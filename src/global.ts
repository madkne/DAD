import { ServerDatabase } from "./internal-db/database";
import { DefinedAPINamespace, EnvironmentVariables } from "./interfaces";
import { APINamespace, MiddlewareName } from "./types";




export namespace Global {

    export let ENV: EnvironmentVariables;

    /**
     * internal database
     */
    export let IDB: ServerDatabase;

    export const IDB_MODELS = ['User'];

    export const INIT_MIDDLEWARES: MiddlewareName[] = ['RequestInit', 'Authentication', 'RoutingResolver'];

    export const AuthenticateUserKey = '_.dad._auth_user_';

    export const CoreRequestKey = '_.dad.core_request';

    export const APINamespaces: DefinedAPINamespace[] = [
        {
            name: 'server',
            description: 'server relative API endpoints'
        },
    ];

    export const APIBaseUrl = '/api/';
}