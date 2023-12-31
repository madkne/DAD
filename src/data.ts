import { BaseSourceDriver } from "./datasource/drivers/base";
import { sqlite } from "./datasource/drivers/sqlite";
import { DefinedAPINamespace, EnvironmentVariables } from "./interfaces";
import { DashboardEntryType, DashboardEntryWidth, DashboardTheme, DatabaseType, ReportMode } from "./types";

export const EnvironmentVariablesKeys: (keyof EnvironmentVariables)[] = [
    'ROOT_USERNAME', 'ROOT_PASSWORD',
    'DB_CONNECTION', 'DB_PATH', 'DB_USERNAME', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME',
    'DS_TYPES',
    'DEBUG_MODE',
    'STORAGE_PATH', 'UPLOADS_PATH', 'PUBLIC_PATH',
    'HTTP_PORT', 'HOSTNAME',
    'SWAGGER_BASE_URL', 'SWAGGER_DISABLED',
    'AUTH_HEADER_NAME', 'AUTH_TOKEN_LIFETIME',
    'SSL', 'SSL_PRIVATE_KEY_PATH', 'SSL_CERTIFICATE_PATH',
    'DASHBOARD_BASE_URL'
];

export const DatabaseTypes: DatabaseType[] = ['sqlite', 'mysql', 'mongo'];

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
    {
        name: 'source',
        description: 'project data source (DS) relative API endpoints'
    },
    {
        name: 'report',
        description: 'project reports relative API endpoints'
    },
    {
        name: 'dashboard',
        description: 'project dashboards relative API endpoints'
    },
    {
        name: 'pipe',
        description: 'project report pipes relative API endpoints'
    },
];//TODO:

export const ReportModes: ReportMode[] = ['area_chart', 'bar_chart', 'line_chart', 'pie_chart', 'table']; //TODO:

export const DashboardThemes: DashboardTheme[] = ['simple']; //TODO:

export const DashboardEntryTypes: DashboardEntryType[] = ['report', 'text'];

export const DashboardEntryWidths: DashboardEntryWidth[] = ['2-10', '4-10', '6-10', '8-10', '10-10'];

export const DatabaseDrivers: { [k in DatabaseType]?: typeof BaseSourceDriver } = {
    sqlite: sqlite,
}; //TODO: