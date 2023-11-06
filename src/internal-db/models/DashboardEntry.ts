import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { DashboardEntryModel } from './interfaces';

export class DashboardEntry extends Model<DashboardEntryModel> { }


export function load() {
    return DashboardEntry.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        dashboard_id: DataTypes.BIGINT,
        report_id: DataTypes.BIGINT,
        entry_type: DataTypes.STRING,
        text: DataTypes.STRING,
        width: DataTypes.STRING,
        height: DataTypes.STRING,

        settings: DataTypes.JSON(),

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'DashboardEntry',
        tableName: 'dashboard_entries',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
}