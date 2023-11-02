import { APINamespace, DatabaseType, InternalDatabaseType, MiddlewareName, RequestMethodType, SwaggerDataType, SwaggerDataTypeFormat } from "./types";

export const EnvironmentVariablesKeys = ['ROOT_USERNAME', 'ROOT_PASSWORD', 'DB_CONNECTION', 'DB_PATH', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DS_TYPES', 'DEBUG_MODE', 'STORAGE_PATH', 'HTTP_PORT', 'SWAGGER_BASE_URL', 'HOSTNAME', 'AUTH_HEADER_NAME'];

export interface EnvironmentVariables {
    /**
     * @default root
     */
    ROOT_USERNAME?: string;
    /**
     * @default root
     */
    ROOT_PASSWORD?: string;

    /**
     * used for internal DAD database
     * @default sqlite
     */
    DB_CONNECTION?: InternalDatabaseType;
    /**
     * just for sqlite connection
     */
    DB_PATH?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_HOST?: string;
    DB_PORT?: number;
    /**
     * @default dad_db
     */
    DB_NAME?: string;

    /**
     * used for projects data sources to install their db drivers
     * @default [sqlite]
     */
    DS_TYPES?: DatabaseType[];
    /**
     * @default false
     */
    DEBUG_MODE?: boolean;
    /**
     * @default ./storage
     */
    STORAGE_PATH?: string;
    /**
     * @default 8082
     */
    HTTP_PORT?: number;
    /**
     * @default /api-docs
     */
    SWAGGER_BASE_URL?: string;
    /**
     * @default localhost
     */
    HOSTNAME?: string;
    /**
     * @default Authorization
     */
    AUTH_HEADER_NAME?: string;
}


export interface ApiRoute {
    method: RequestMethodType;
    path: string;
    namespace: APINamespace;
    // response: (req: Request, res: Response) => any;
    functionName: string;
    includeMiddlewares?: MiddlewareName[];
    /**
     * not need to add auth header in request
     */
    noAuth?: boolean;
    /**
     * @default v1
     */
    version?: 'v1';
    /**
     * used for auth middleware, routing
     */
    absPath?: string;
    /**
     * for swagger
     */
    des?: string;
    /**
     * for swagger
     * long description
     */
    description?: string;
    /**
     * for swagger
     */
    consumes?: ('multipart/form-data' | 'application/json')[];
    /**
     * for swagger
     */
    responses?: {
        [k: string]: SwaggerApiResponse;
    };
    /**
     * for swagger
     */
    parameters?: SwaggerApiParameter[];
    /**
     * for swagger
     */
    deprecated?: boolean;
    /**
     * for swagger
     * select interfaces, types of source code
     */
    usedDefinitions?: string[];
}

export interface SwaggerDefinition {
    type: SwaggerDataType;
    properties: {
        [k: string]: {
            type: SwaggerDataType;
            format?: SwaggerDataTypeFormat;
        }
    };
    required?: string[];
}
export interface SwaggerApiResponse {
    description: string;
    // content?: {
    //     [k in 'application/json' | '*/*' | 'application/x-www-form-urlencoded']?: {
    //         schema?: {
    //             $ref?: string;
    //             type: SwaggerDataType;
    //             items?: object;
    //         };
    //     };
    // };
    schema?: {
        type?: SwaggerDataType;
        items?: {};
        $ref?: string;
    };
    example?: string;

}
export interface SwaggerApiParameter {
    name: string;
    summary?: string;
    description?: string;
    example?: any;
    /**
     * path parameters, such as /users/{id}
     * query parameters, such as /users?role=admin
     * header parameters, such as X-MyHeader: Value
     * cookie parameters, which are passed in the Cookie header, such as Cookie: debug=0; csrftoken=BUSe35dohU3O1MZvDCU
     */
    in: 'query' | 'path' | 'header' | 'cookie' | 'body' | 'formData';
    required?: boolean;
    type?: SwaggerDataType;
    format?: SwaggerDataTypeFormat;
    allowEmptyValue?: boolean;
    schema?: {
        type?: SwaggerDataType;
        properties?: {
            [k: string]: {
                type?: SwaggerDataType;
                format?: SwaggerDataTypeFormat;
                description?: string;
                default?: any;
                $ref?: string;
                required?: boolean;
            };
        };
        defaultProperties?: any;
    };
    /**
     * for array type
     */
    items?: {
        type?: SwaggerDataType;
        format?: SwaggerDataTypeFormat;
        enum?: string[];
        default?: any;
        $ref?: string;
    };
    collectionFormat?: 'multi';
    default?: any;
}
