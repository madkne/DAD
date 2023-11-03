import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { ConfigModel } from './interfaces';

export class Config extends Model<ConfigModel> { }


export function load() {
    return Config.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        key: DataTypes.STRING,
        data_type: {
            type: DataTypes.STRING,
            defaultValue: 'string',
        },
        value: DataTypes.TEXT,

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'Config',
        tableName: 'configs',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
}