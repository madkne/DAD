

export type DatabaseType = 'sqlite' | 'mysql' | 'mongo';

export type InternalDatabaseType = Exclude<DatabaseType, 'mongo'>;

export type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type MiddlewareName = 'RequestInit' | 'Authentication' | 'FormDataParser' | 'RoutingResolver';

export type APINamespace = 'server' | 'project' | 'user' | 'source' | 'report' | 'dashboard' | 'pipe'; //TODO:

export enum HttpStatusCode {
    HTTP_100_CONTINUE = 100,
    HTTP_101_SWITCHING_PROTOCOLS = 101,
    HTTP_102_PROCESSING = 102,

    HTTP_200_OK = 200,
    HTTP_201_CREATED = 201,
    HTTP_202_ACCEPTED = 202,

    HTTP_301_MOVED_PERMANENTLY = 301,
    HTTP_302_MOVED_TEMPORARILY = 302,
    HTTP_303_SEE_OTHER = 303,
    HTTP_304_NOT_MODIFIED = 304,
    HTTP_305_USE_PROXY = 305,
    HTTP_306_SWITCH_PROXY = 306,
    HTTP_307_TEMPORARY_REDIRECT = 307,
    HTTP_308_PERMANENT_REDIRECT = 308,

    HTTP_400_BAD_REQUEST = 400,
    HTTP_401_UNAUTHORIZED = 401,
    HTTP_403_FORBIDDEN = 403,
    HTTP_404_NOT_FOUND = 404,
    HTTP_405_METHOD_NOT_ALLOWED = 405,
    HTTP_406_NOT_ACCEPTABLE = 406,
    HTTP_408_REQUEST_TIMEOUT = 408,
    HTTP_409_CONFLICT = 409,
    HTTP_429_TOO_MANY_REQUESTS = 429,

    HTTP_500_INTERNAL_SERVER_ERROR = 500,
    HTTP_501_NOT_IMPLEMENTED = 501,
    HTTP_502_BAD_GATEWAY = 502,
    HTTP_503_SERVICE_UNAVAILABLE = 503,
    HTTP_504_GATEWAY_TIMEOUT = 504,
    HTTP_505_HTTP_VERSION_NOT_SUPPORTED = 505,
}

export type SwaggerDataType = 'array' | 'string' | 'integer' | 'object' | 'number' | 'boolean' | 'file';
export type SwaggerDataTypeFormat = 'int32' | 'int64' | 'string' | 'password' | 'date-time' | 'date' | 'binary' | 'byte' | 'double' | 'float';

export type HttpResponse = [string, HttpStatusCode, string];


export type DBConfigKey = 'server.is_installed'; //TODO:

export type ReportMode = 'bar_chart' | 'line_chart' | 'area_chart' | 'pie_chart' | 'table'; //TODO: add multi charts

export type DashboardTheme = 'simple'; //TODO:

export type DashboardEntryType = 'report' | 'text';

export type DashboardEntryWidth = '2-10' | '4-10' | '6-10' | '8-10' | '10-10';