import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { UserModel } from './interfaces';

export class User extends Model<UserModel> { }


export function load() {
    return User.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        settings: DataTypes.JSON(),

        online_at: DataTypes.DATE(6),
        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        deleted_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'User',
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true, // for soft delete
    });
}