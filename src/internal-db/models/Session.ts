import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { SessionModel } from './interfaces';

export class Session extends Model<SessionModel> { }


export function load() {
    return Session.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: DataTypes.BIGINT,
        ip: DataTypes.STRING,
        token: DataTypes.STRING,
        user_agent: DataTypes.STRING,
        refresh_token: DataTypes.STRING,

        checked_token_at: DataTypes.DATE(6),
        checked_refresh_token_at: DataTypes.DATE(6),
        expired_token_at: DataTypes.DATE(6),
        created_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'Session',
        tableName: 'sessions',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
}