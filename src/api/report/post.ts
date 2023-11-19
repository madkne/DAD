import { errorLog } from "../../common";
import { DataSource } from "../../internal-db/models/DataSource";
import { Project } from "../../internal-db/models/Project";
import { Report } from "../../internal-db/models/Report";
import { BaseAPI } from "../../server/base-api";
import { ReportMode } from "../../types";


export class post extends BaseAPI {

    async addByQuery() {
        // =>get params
        const projectName = this.param('project_name');
        const sourceName = this.param('source_name');
        const name = this.param('name');
        const mode = this.param<ReportMode>('mode');
        const query = this.param('query');
        const order = this.paramNumber('order');
        try {
            // =>find project by name
            const project = await Project.findOne({ where: { name: projectName } });
            if (!project) return this.error404('not found such project');
            // =>check no duplicate report name
            if ((await Report.findAll({ where: { project_id: project.getDataValue('id'), name } })).length > 0) {
                return this.error400('duplicate report name on this project');
            }
            // =>find source by name
            const source = await DataSource.findOne({ where: { name: sourceName } });
            if (!source) return this.error404('not found such data source');

            // =>add report
            const newReport = await Report.create({
                project_id: project.getDataValue('id'),
                source_id: source.getDataValue('id'),
                refresh_time: 60000,
                mode,
                name,
                display: {},
                data: {
                    query,
                },
                settings: {},
                order,
            });
            return this.response(newReport);
        } catch (e) {
            errorLog('err3222', e);
            return this.error400();
        }
    }
}