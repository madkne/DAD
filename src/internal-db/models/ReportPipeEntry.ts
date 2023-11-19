import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { ReportPipeEntryModel } from './interfaces';

export class ReportPipeEntry extends Model<ReportPipeEntryModel> { }


export function load() {
    return ReportPipeEntry.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: DataTypes.BIGINT,
        report_id: DataTypes.BIGINT,
        pipe_id: DataTypes.BIGINT,
        order: DataTypes.BIGINT,

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'ReportPipeEntry',
        tableName: 'report_pipe_entries',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
}