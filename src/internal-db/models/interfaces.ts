import { DBConfigKey, DashboardEntryType, DashboardEntryWidth, DashboardTheme, DatabaseType, ReportMode } from "../../types";

export interface _BaseModel {
    id?: number;

    created_at?: number;
    updated_at?: number;
    deleted_at?: number;
}

export interface UserModel extends _BaseModel {
    username: string;
    password?: string;
    /**
     * 0 means no admin
     */
    admin_level?: number;
    settings?: {};
    online_at?: number;
}

export type ConfigValueType = 'number' | 'string' | 'json';
export interface ConfigModel {
    id?: number;
    key: DBConfigKey;
    /**
     * @default string
     */
    data_type?: ConfigValueType;
    value?: any;
    created_at?: number;
    updated_at?: number;
}

export interface SessionModel {
    id?: number;
    user_id: number;
    ip: string;
    token: string;
    user_agent: string;
    refresh_token: string;
    checked_token_at: number;
    checked_refresh_token_at: number;
    expired_token_at: number;
    created_at: number;
}

export interface ProjectModel extends _BaseModel {
    name: string;

    settings?: {};
}

export interface DataSourceSettings {
    sqlite_path?: string;
    is_external_sqlite?: boolean;
}

export interface DataSourceModel extends _BaseModel {
    project_id: number;
    name: string;
    source_type: DatabaseType;
    settings?: DataSourceSettings;
}

export interface ReportModel extends _BaseModel {
    project_id: number;
    source_id: number;
    name: string;
    /**
     * @default table
     */
    mode: ReportMode;
    /**
     * @default 60000
     */
    refresh_time?: number;
    settings?: {
    };
    data?: {
        query?: string;
        /**
         * the field of query result that must use as label like name field
         */
        label_field?: string;
        /**
         * the field of query result that must use as data number like count field
         */
        data_field?: string
    };
    display?: {
        title?: string;
        description?: string;
    };
    order?: number;
}


export interface ProjectPipeModel extends _BaseModel {
    project_id: number;
    name: string;
    /**
     * @default run_js_script
     */
    type: 'run_js_script';// | 'call_api';//TODO:
    /**
     * @default after_query
     */
    event: 'after_query';
    /**
     * starts with http:// or https://
     */
    api_endpoint?: string;
    /**
     * @default get
     */
    api_method?: 'get' | 'post' | 'put';
    /**
     * @example function boot(inputs) {
     * @example var result = inputs['query_result'];
     * @example return result;
     * 
     */
    js_script?: string;
    settings?: {};
    /**
     * pipe must be success, or fail all pipes at all!
     */
    required?: boolean;
}

export type ProjectPipeDefinition = Omit<ProjectPipeModel, 'id' | 'project_id' | 'created_at' | 'updated_at' | 'deleted_at'>;


export interface ReportPipeEntryModel {
    id?: number;
    project_id: number;
    report_id: number;
    pipe_id: number;
    order?: number;
    created_at?: number;
    updated_at?: number;
}


export interface DashboardModel extends _BaseModel {
    project_id: number;
    name: string;
    title?: string;
    auto_refresh?: 'off' | '1min' | '5min' | '30min' | '60min';
    theme?: DashboardTheme;
    /**
     * get password from user to show dashboard
     */
    password?: string;
    description?: string;
    settings?: {
    };
}

export interface DashboardEntryModel {
    id?: number;
    dashboard_id: number;
    entry_type: DashboardEntryType;
    report_id?: number;
    text?: string;
    width: DashboardEntryWidth;
    /**
     * if not set, set as auto
     * @example 200px
     */
    height?: string;
    settings?: {
        click_behavior?: {
            behavior: 'link_url';
            url?: string;
        }
    }
    created_at?: number;
    updated_at?: number;
}