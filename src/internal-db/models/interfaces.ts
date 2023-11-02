

export interface UserModel {
    id?: number;
    username: string;
    password?: string;
    settings?: {};
    online_at?: number;
    created_at?: number;
    updated_at?: number;
    deleted_at?: number;
}