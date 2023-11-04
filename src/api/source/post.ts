import { errorLog } from "../../common";
import { DataSource } from "../../internal-db/models/DataSource";
import { Project } from "../../internal-db/models/Project";
import { BaseAPI } from "../../server/base-api";
import { DatabaseType } from "../../types";
import * as fs from 'fs';

export class post extends BaseAPI {
    async addSqliteByPath() {
        // =>get params
        const name = this.param('name');
        const projectName = this.param('project_name');
        const sqlitePath = this.param('path');
        try {
            // =>check admin
            if (!await this.isAdmin()) return this.error403('need admin access');
            // =>find project by name
            const project = await Project.findOne({ where: { name: projectName } });
            if (!project) return this.error404('not found such project');
            // =>check no duplicate source name
            if ((await DataSource.findAll({ where: { project_id: project.getDataValue('id'), name } })).length > 0) {
                return this.error400('duplicate source name on this project');
            }
            // =>check exist path
            if (!fs.existsSync(sqlitePath)) {
                return this.error400('not exist such path');
            }
            // =>add source
            let newSource = await DataSource.create({
                name,
                project_id: project.getDataValue("id"),
                source_type: 'sqlite',
                settings: {
                    sqlite_path: sqlitePath,
                    is_external_sqlite: true,
                },
            });
            return this.response(newSource);
        } catch (e) {
            errorLog('err2342', e);
            return this.error400();
        }
    }
}