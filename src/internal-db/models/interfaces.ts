

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