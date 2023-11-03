import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { DataSourceModel } from './interfaces';

export class DataSource extends Model<DataSourceModel> { }


export function load() {
    return DataSource.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: DataTypes.BIGINT,
        name: DataTypes.STRING,
        source_type: DataTypes.STRING,
        settings: DataTypes.JSON(),

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        deleted_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'DataSource',
        tableName: 'data_sources',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true, // for soft delete
    });
}