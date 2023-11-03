import { DBConfigKey, DatabaseType } from "../../types";

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

export interface DataSourceModel extends _BaseModel {
    project_id: number;
    name: string;
    source_type: DatabaseType;
    settings?: {};

}