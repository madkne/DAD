import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { ReportModel } from './interfaces';

export class Report extends Model<ReportModel> { }


export function load() {
    return Report.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: DataTypes.BIGINT,
        source_id: DataTypes.BIGINT,
        name: DataTypes.STRING,
        mode: DataTypes.STRING,
        refresh_time: DataTypes.BIGINT,

        settings: DataTypes.JSON(),
        display: DataTypes.JSON(),
        data: DataTypes.JSON(),

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        deleted_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'Report',
        tableName: 'reports',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true, // for soft delete
    });
}