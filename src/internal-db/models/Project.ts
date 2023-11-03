import { DataTypes, Model } from 'sequelize';
import { Global } from '../../global';
import { ProjectModel } from './interfaces';

export class Project extends Model<ProjectModel> { }


export function load() {
    return Project.init({
        // Model attributes are defined here
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
        },
        settings: DataTypes.JSON(),

        created_at: DataTypes.DATE(6),
        updated_at: DataTypes.DATE(6),
        deleted_at: DataTypes.DATE(6),
    }, {
        sequelize: Global.IDB.dbConn,
        modelName: 'Project',
        tableName: 'projects',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        paranoid: true, // for soft delete
    });
}