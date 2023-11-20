import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { ProjectPipeModel } from './interfaces';

export class ProjectPipe extends Model<ProjectPipeModel> { }


export function load() {
    return ProjectPipe.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        project_id: DataTypes.BIGINT,
        name: DataTypes.STRING,
        type: DataTypes.STRING,
        event: DataTypes.STRING,
        api_endpoint: DataTypes.STRING,
        api_method: DataTypes.STRING,
        js_script: DataTypes.TEXT,
        required: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        settings: DataTypes.JSON(),

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        deleted_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'ProjectPipe',
        tableName: 'project_pipes',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true, // for soft delete
    });
}