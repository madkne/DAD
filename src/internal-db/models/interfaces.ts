import { DBConfigKey } from "../../types";


export interface UserModel {
    id?: number;
    username: string;
    password?: string;
    /**
     * 0 means no admin
     */
    admin_level?: number;
    settings?: {};
    online_at?: number;
    created_at?: number;
    updated_at?: number;
    deleted_at?: number;
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