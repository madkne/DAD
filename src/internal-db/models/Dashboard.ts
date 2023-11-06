import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { DashboardModel } from './interfaces';

export class Dashboard extends Model<DashboardModel> { }


export function load() {
    return Dashboard.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: DataTypes.BIGINT,
        name: DataTypes.STRING,
        title: DataTypes.STRING,
        auto_refresh: DataTypes.STRING,
        password: DataTypes.STRING,
        theme: DataTypes.STRING,
        description: DataTypes.STRING,

        settings: DataTypes.JSON(),

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        deleted_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'Dashboard',
        tableName: 'dashboards',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true, // for soft delete
    });
}